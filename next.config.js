module.exports = {
  future: {
    webpack5: true
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    };
    return config;
  },
};
