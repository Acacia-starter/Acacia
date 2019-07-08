const webpack = require('webpack')
const webpackConfig = require('../config/utils').getWebpackConfig()

const compiler = webpack(webpackConfig.config)
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(stats.toString(webpackConfig.config.stats))
})
