const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const LinkedinTokenStrategy = require('passport-linkedin-token-v2');
const config = require('./configuration');
const User = require('./models/user');

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    req.user = user;
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

// Linkedin OAuth Strategy
passport.use('candidate-linkedin',new LinkedinTokenStrategy({
  clientID: config.oauth.linkedin.clientID,
  clientSecret: config.oauth.linkedin.clientSecret,
  redirectURL: '', // Add redirect URL after sucessfull login
  scope: ["r_emailaddress", "r_liteprofile"]
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one

    if (req.user) {
      // We're already logged in, time for linking account!
      // Add Linkedin's data to an existing account
      req.user.methods.push('linkedin')
      req.user.linkedin = {
        id: profile.id,
        email: profile.emails[0].value
      }
      await req.user.save()
      return done(null, req.user);
    } else {
      // We're in the account creation process
      let existingUser = await User.findOne({ "linkedin.id": profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if we have someone with the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value })
      if (existingUser) {
        // We want to merge linkedin's data with local auth
        existingUser.methods.push('linkedin')
        existingUser.linkedin = {
          id: profile.id,
          email: profile.emails[0].value
        }
        await existingUser.save()
        return done(null, existingUser);
      }

      const newUser = new User({
        methods: ['linkedin'],
        linkedin: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
  
      await newUser.save();
      done(null, newUser);
    }
  } catch(error) {
    done(error, false, error.message);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email });
    
    // If not, handle it
    if (!user) {
      return done(null, false);
    }
  
    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);
  
    // If not, handle it
    if (!isMatch) {
      return done(null, false);
    }
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));