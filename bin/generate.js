const webpack = require('webpack')
const getProjectConfig = require('../config/ProjectConfig')
const getWebpackConfig = require('../config/WebpackConfig')

const projectConfig = getProjectConfig()
const webpackConfig = getWebpackConfig(projectConfig)

const compiler = webpack(webpackConfig.config)
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(stats.toString(webpackConfig.config.stats))
})
