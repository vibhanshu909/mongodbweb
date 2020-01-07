const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

module.exports = withCSS(
  withImages({
    target: 'serverless',
    poweredByHeader: false,
    esModule: true,
    webpack(config, options) {
      return config
    },
  }),
)
