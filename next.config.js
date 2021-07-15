const withPWA = require('next-pwa')

module.exports = withPWA({
  future: {
    webpack5: true
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    };
    return config;
  },
  pwa: {
    dest: 'public',
    disable: true
  }
});
