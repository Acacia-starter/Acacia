// Add log & emoji

import path from 'path'
import WebpackConfig from './build/WebpackConfig'
import fs from 'fs'
import getFullAkaruConfig from './build/AkaruConfig'
// plugins
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ExtraWatchWebpackPlugin from 'extra-watch-webpack-plugin'
import SvgSpriteHtmlWebpackPlugin from 'svg-sprite-html-webpack'

require('@babel/register')

const envs = {
  NODE_ENV: process.env.NODE_ENV || 'development'
}

const akaruConfig = getFullAkaruConfig()

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

const svgoLoader = {
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
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    }
  })
  .addRule({
    test: /.pug$/,
    use: 'pug-loader'
  })
  .addRule({
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader'
    ]
  })
  .addRule({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      'file-loader'
    ]
  })
  .addRule({
    test: /.svg$/,
    exclude: /sprite\/.*\.svg$/,
    use: [svgoLoader]
  })
  .addPlugin(new MiniCssExtractPlugin({
    filename: akaruConfig.filenames.styles
  }))
  .addPlugin(new ExtraWatchWebpackPlugin({
    files: [paths.views('**/data.js')]
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
    .addFavicon(paths.base(akaruConfig.favicon), akaruConfig.title)
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
    test: /sprite\/.*\.svg$/,
    use: [{
      loader: SvgSpriteHtmlWebpackPlugin.getLoader()
    }, svgoLoader]
  })
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

akaruConfig.langs.forEach(lang => {
  pages.forEach(pageName => {
    let filename = paths.dist((lang === akaruConfig.defaultLang) ? '' : lang, (pageName === akaruConfig.index) ? '' : pageName, 'index.html')

    WebpackConfig.addPlugin(new HtmlWebpackPlugin({
      filename,
      cache: false,
      template: paths.views('pages', pageName, 'index.pug'),
      templateParameters: (compilation, assets, options) => {
        delete require.cache[paths.views('pages', pageName, 'data.js')]
        delete require.cache[paths.views('data.js')]

        let page = require(paths.views('pages', pageName, 'data.js'))['default']()
        let base = require(paths.views('data.js'))['default']()

        // Config de la langue actuelle, fallback dans la langue default, fallback dans l'objet de base
        return {
          ...base,
          ...base[akaruConfig.defaultLang],
          ...base[lang],
          ...page,
          ...page[akaruConfig.defaultLang],
          ...page[lang]
        }
      }
    }))
  })
})

if (akaruConfig.svgSprite.active) {
  WebpackConfig.addPlugin(new SvgSpriteHtmlWebpackPlugin({
    generateSymbolId: (svgFilePath, svgHash, svgContent) => {
      return path.parse(svgFilePath).name
    }
  }))
}

module.exports = WebpackConfig.getConfig()
