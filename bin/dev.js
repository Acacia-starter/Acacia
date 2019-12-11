const webpack = require('webpack')
const getConfig = require('../config/Config')
const WebpackDevServer = require('webpack-dev-server')
const getWebpackConfig = require('../config/WebpackConfig')

const config = getConfig()
const webpackConfig = getWebpackConfig(config)

const { host, port, stats } = webpackConfig.config.devServer

const options = {
  stats,
  hot: true,
  host,
  clientLogLevel: 'warning'
}

const compiler = webpack(webpackConfig.config)
const server = new WebpackDevServer(compiler, options)

server.listen(port, host, function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`WebpackDevServer listening at ${host}:${port}`)
})
