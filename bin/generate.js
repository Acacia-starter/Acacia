const webpack = require('webpack')
const getConfig = require('../config/Config')
const getWebpackConfig = require('../config/WebpackConfig')

const config = getConfig()
const webpackConfig = getWebpackConfig(config)

const compiler = webpack(webpackConfig.config)
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(stats.toString(webpackConfig.config.stats))
})
