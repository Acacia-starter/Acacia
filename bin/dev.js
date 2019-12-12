const webpack = require('webpack')
const getProjectConfig = require('../config/ProjectConfig')
const WebpackDevServer = require('webpack-dev-server')
const getWebpackConfig = require('../config/WebpackConfig')

const projectConfig = getProjectConfig()
const webpackConfig = getWebpackConfig(projectConfig)

const { host, port } = webpackConfig.config.devServer

const compiler = webpack(webpackConfig.config)
const server = new WebpackDevServer(compiler, webpackConfig.config.devServer)

server.listen(port, host, function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`\x1b[32mWebpackDevServer listening at ${host}:${port}\x1b[0m`)
})
