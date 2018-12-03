const Config = require('./Config')
const WebpackConfig = require('./WebpackConfig')
const { overrideConfig, overrideWebpackConfig } = require('../akaru.config')

const env = process.env.NODE_ENV

let config = new Config(env)

if (overrideConfig) {
  overrideConfig(config, { env })

  if (!config) {
    console.warn('\x1b[31m%s\x1b[0m', 'You need to return your config in overrideConfig method')
    process.exit(0)
  }
}

let webpackConfig = new WebpackConfig(config)

if (overrideWebpackConfig) {
  overrideWebpackConfig(webpackConfig, { config, env })

  if (!webpackConfig) {
    console.warn('\x1b[31m%s\x1b[0m', 'You need to return your webpackConfig in overrideWebpackConfig method')
    process.exit(0)
  }
}

// console.log('#########')
// console.log('#########')
// console.log('#########')
// console.log(webpackConfig.config)
// process.exit(0)
module.exports = webpackConfig.config