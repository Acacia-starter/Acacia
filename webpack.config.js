const path = require('path')
const fs = require('fs')
const akaruConfig = require('./akaru.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const devMode = process.env.NODE_ENV === 'development'

let config = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'generate'),
    filename: 'bundle.js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'generate')),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["eslint-loader"],
        enforce: 'pre'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  }
}

let pageDir = path.resolve(__dirname, 'views/pages')
let pages = fs.readdirSync(pageDir)

pages.forEach(page => {

  let filename = path.resolve(__dirname, 'generate', (page === akaruConfig.index) ? '' : page, 'index.html')

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
