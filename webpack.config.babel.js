import path from 'path'
import WebpackConfig from './build/WebpackConfig'
import fs from 'fs'
import userAkaruConfig from './akaru.config'
import getFullAkaruConfig from './build/AkaruConfig'
// plugins
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import SpriteLoaderPlugin from 'svg-sprite-loader/plugin'
require('babel-register')

const envs = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  ZIP: process.env.ZIP || false
}

const akaruConfig = getFullAkaruConfig(userAkaruConfig, envs.NODE_ENV)

const pathBase = path.resolve(__dirname)
const paths = {
  base: (...args) => path.resolve(pathBase, ...args),
  js: (...args) => path.resolve(pathBase, akaruConfig.paths.js, ...args),
  styles: (...args) => path.resolve(pathBase, akaruConfig.paths.styles, ...args),
  svg: (...args) => path.resolve(pathBase, akaruConfig.paths.svg, ...args),
  views: (...args) => path.resolve(pathBase, akaruConfig.paths.views, ...args),
  dist: (...args) => path.resolve(pathBase, akaruConfig.paths.dist, ...args),
  static: (...args) => path.resolve(pathBase, akaruConfig.paths.static, ...args)
}

/*

  Base config

*/

WebpackConfig
  .setMode(envs.NODE_ENV)
  .setPaths(paths)
  .setEnvs(envs)
  .setEntry('bundle', paths.js('index.js'))
  .setOutput({
    publicPath: '/',
    path: paths.dist(),
    filename: akaruConfig.filenames.js
  })
  .setStats(akaruConfig.webpackStats)
  .addRule({
    test: /.pug$/,
    use: 'pug-loader'
  })
  .addPlugin(new MiniCssExtractPlugin({
    filename: akaruConfig.filenames.styles
  }))
  .copyStatic(paths.static())

/*

  Development

*/
if (WebpackConfig.mode === 'development') {
  WebpackConfig
    .addRule({
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: akaruConfig.sourcemaps
          }
        },
        (akaruConfig.postcss) ? 'postcss-loader' : '',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: akaruConfig.sourcemaps
          }
        }
      ]
    })
    .setDevServerPort(akaruConfig.port)
}

/*

  Production

*/
if (WebpackConfig.mode === 'production') {
  WebpackConfig
    .addRule({
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        (akaruConfig.postcss) ? 'postcss-loader' : '',
        'sass-loader'
      ]
    })
}

/*

  Akaru config

*/

if (akaruConfig.cleanBeforeBuild) {
  WebpackConfig.cleanOutput()
}

if (akaruConfig.zip) {
  WebpackConfig.zipBuild(paths.base(), akaruConfig.name)
}

if (akaruConfig.svgSprite.active) {
  WebpackConfig.addRule({
    test: /\.svg$/,
    use: [{
      loader: 'svg-sprite-loader',
      options: {
        extract: true,
        spriteFilename: paths.dist(akaruConfig.svgSprite.filename)
      }
    }, {
      loader: 'svgo-loader',
      options: {
        plugins: [{
          cleanupAttrs: true
        }, {
          removeDoctype: true
        }, {
          removeXMLProcInst: true
        }, {
          removeComments: true
        }, {
          removeMetadata: true
        }, {
          removeTitle: true
        }, {
          removeDesc: true
        }, {
          removeUselessDefs: true
        }, {
          removeEditorsNSData: true
        }, {
          removeEmptyAttrs: true
        }, {
          removeHiddenElems: true
        }, {
          removeEmptyText: true
        }, {
          removeEmptyContainers: true
        }, {
          removeViewBox: false
        }, {
          cleanUpEnableBackground: true
        }, {
          convertStyleToAttrs: true
        }, {
          convertColors: true
        }, {
          convertPathData: true
        }, {
          convertTransform: true
        }, {
          removeUnknownsAndDefaults: true
        }, {
          removeNonInheritableGroupAttrs: true
        }, {
          removeUselessStrokeAndFill: true
        }, {
          removeUnusedNS: true
        }, {
          cleanupIDs: true
        }, {
          cleanupNumericValues: true
        }, {
          moveElemsAttrsToGroup: true
        }, {
          moveGroupAttrsToElems: true
        }, {
          collapseGroups: true
        }, {
          removeRasterImages: false
        }, {
          mergePaths: true
        }, {
          convertShapeToPath: true
        }, {
          sortAttrs: true
        }, {
          transformsWithOnePath: false
        }, {
          removeDimensions: true
        }, {
          removeAttrs: { attrs: '(stroke|fill)' }
        }]
      }
    }]
  })
    .addPlugin(new SpriteLoaderPlugin({
      plainSprite: true
    }))
}

if (akaruConfig.eslint) {
  WebpackConfig.addRule({
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'eslint-loader',
    enforce: 'pre'
  })
}

/*

  Create pages

*/
const pages = fs.readdirSync(paths.views('pages'))

pages.forEach(pageName => {
  let filename = paths.dist((pageName === akaruConfig.index) ? '' : pageName, 'index.html')

  WebpackConfig.addPlugin(new HtmlWebpackPlugin({
    filename,
    template: paths.views('pages', pageName, 'index.pug'),
    templateParameters: () => ({
      ...require(paths.views('pages', pageName, 'data.js')),
      ...require(paths.views('base.data.js'))
    })
  }))
})

module.exports = WebpackConfig.getConfig()
