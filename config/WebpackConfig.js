const path = require('path')

class WebpackConfig {
  constructor (config) {
    this.config = config
  }

  getConfig () {
    return {
      entry: './app/js/index.js',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      }
    }
  }
}

module.exports = WebpackConfig
