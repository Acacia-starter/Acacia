const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../config/index.babel')
const path = require('path')

const { host, port, stats } = config.devServer

const options = {
  stats,
  hot: true,
  host,
  clientLogLevel: 'warning',
  contentBase: path.resolve(__dirname, '../generate'),
  watchContentBase: true
}

WebpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new WebpackDevServer(compiler, options)

server.listen(port, host, function (err) {
  if (err) {
    console.log(err)
  }
  console.log(`WebpackDevServer listening at ${host}:${port}`)
})
