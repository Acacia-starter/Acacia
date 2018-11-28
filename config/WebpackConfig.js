const path = require('path')

class WebpackConfig {
  constructor (config) {
    this.config = config
  }

  getConfig () {
    return {
      mode: 'development',
      entry: './assets/js/index.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'generate')
      }
    }
  }
}

module.exports = WebpackConfig
