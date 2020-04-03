const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');

signToken = user => {
  return JWT.sign({
    iss: 'LuisMendes',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    // Check if there is a user with the same email
    let foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }

    // Is there a Linkedin account with the same email?
    foundUser = await User.findOne({ "linkedin.email": email });
    if (foundUser) {
      // Let's merge them?
      foundUser.methods.push('local')
      foundUser.local = {
        email: email, 
        password: password
      }
      await foundUser.save()
      // Generate the token
      const token = signToken(foundUser);
      // Respond with token
      res.cookie('access_token', token, {
        httpOnly: true
      });
      return res.status(200).json({ success: true });
    }

    // Create a new user
    const newUser = new User({ 
      methods: ['local'],
      local: {
        email: email, 
        password: password
      }
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Send a cookie containing JWT
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  signIn: async (req, res, _next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  signOut: async (_req, res, _next) => {
    res.clearCookie('access_token');
    return res.sendStatus(200);
  },

  linkedinOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    }); 
    res.status(200).json({ success: true });
  },

  linkLinkedin: async (req, res, next) => {
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully linked account with Linkedin' 
    });
  },

  unlinkLinkedin: async (req, res, next) => {
    // Delete Linkedin sub-object
    if (req.user.linkedin) {
      req.user.linkedin = undefined
    }
    // Remove 'linkedin' from methods array
    const linkedinStrPos = req.user.methods.indexOf('linkedin')
    if (linkedinStrPos >= 0) {
      req.user.methods.splice(linkedinStrPos, 1)
    }
    await req.user.save()

    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Linkedin' 
    });
  },

  dashboard: async (req, res, _next) => {
    res.json({ 
      secret: "resource",
      methods: req.user.methods
    });
  },

  checkAuth: async (_req, res, _next) => {
    res.json({ success: true });
  }
}
