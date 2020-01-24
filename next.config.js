const withImages = require('next-images')

module.exports = withImages({
  target: 'serverless',
  poweredByHeader: false,
  esModule: true,
  webpack(config, options) {
    return config
  },
})
