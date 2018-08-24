const path = require('path')
const fs = require('fs')
const glob = require('glob')
const akaruConfig = require('./akaru.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let config = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'generate'),
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'generate'))
  ],
  module: {
    rules: [
      {
        test: /.pug$/,
      use: 'pug-loader'
      }
    ]
  }
}

let pageDir = path.resolve(__dirname, 'views/pages')
let pages = fs.readdirSync(pageDir)

pages.forEach(page => {




  let filename = path.resolve(__dirname, 'generate', (page === akaruConfig.index) ? '' : page, 'index.html')
  console.log('filename', filename);



  config.plugins.push(new HtmlWebpackPlugin({
          filename,
          template: path.resolve(pageDir, page, 'index.pug'),
          templateParameters: {
            ...require(path.resolve(pageDir, page, 'data.js')),
            ...require(path.resolve(__dirname, 'views', 'base.data.js'))
          }
        }))
})

module.exports = config
