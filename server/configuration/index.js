if (process.env.NODE_ENV === 'test') {
  module.exports = {
    JWT_SECRET: 'LuisMendes',
    oauth: {
      linkedin: {
        clientID: '77zasl9w1f82az',
        clientSecret: 'JFeqcDTMeHgXXe2r',
      }
    },
  };
} else {
  module.exports = {
    JWT_SECRET: 'LuisMendes',
    oauth: {
      linkedin: {
        clientID: '77zasl9w1f82az',
        clientSecret: 'JFeqcDTMeHgXXe2r',
      }
    },
  };
}