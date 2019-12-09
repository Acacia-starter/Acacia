const path = require('path')
const webpack = require('webpack')
const akaruConfig = require('../akaru.config')

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const Critters = require('critters-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

class WebpackConfig {
  constructor (userConfig) {
    this.userConfig = userConfig

    this.setRules()
    this.setPlugins()
    this.setConfig()

    if (akaruConfig.extendWebpackConfig) {
      akaruConfig.extendWebpackConfig(this.config, { env: this.userConfig.env, isProduction: this.userConfig.isProduction(), isDevelopment: this.userCOnfig.isDevelopment() })
    }
  }

  setConfig () {
    this.config = {
      mode: (['development', 'production'].indexOf(this.userConfig.env) > -1) ? this.userConfig.env : 'none',
      entry: this.userConfig.js.entries.concat(this.userConfig.styles.entries),
      output: {
        path: this.userConfig.paths.dist(),
        filename: this.userConfig.js.outputName,
        chunkFilename: this.userConfig.js.outputChunkName
      },
      module: {
        rules: this.rules
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json'],
        alias: Object.assign({}, {
          '~': this.userConfig.paths.base(),
          '~j': this.userConfig.paths.js(),
          '~s': this.userConfig.paths.styles(),
          '~i': this.userConfig.paths.images(),
          '~c': this.userConfig.paths.components(),
          '~p': this.userConfig.paths.pages(),
          '~l': this.userConfig.paths.layouts()
        }, this.userConfig.alias)
      },
      devtool: this.userConfig.devtool,
      context: this.userConfig.paths.base(),
      target: 'web',
      externals: this.userConfig.externals,
      stats: this.userConfig.stats,
      devServer: this.userConfig.devServer,
      plugins: this.plugins
    }

    if (this.userConfig.js.minify || this.userConfig.styles.minify) {
      const minimizer = []

      if (this.userConfig.js.minify) {
        minimizer.push(new TerserJSPlugin())
      }
      if (this.userConfig.styles.minify) {
        minimizer.push(new OptimizeCSSAssetsPlugin())
      }

      this.config.optimization = {
        minimizer
      }
    }
  }

  setRules () {
    this.rules = []

    // Js
    this.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader'
      ]
    })

    // Eslint
    if (this.userConfig.js.eslint) {
      this.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'eslint-loader',
          options: {
            fix: this.userConfig.js.eslintFix
          }
        }],
        enforce: 'pre'
      })
    }

    // Styles
    const styleLoaders = []
    if (this.userConfig.styles.extract) {
      styleLoaders.push(MiniCssExtractPlugin.loader)
    } else {
      styleLoaders.push({
        loader: 'style-loader'
      })
    }
    styleLoaders.push({
      loader: 'css-loader',
      options: {
        sourceMap: this.userConfig.styles.sourcemaps
      }
    })
    if (this.userConfig.styles.postcss) {
      styleLoaders.push({
        loader: 'postcss-loader'
      })
    }
    styleLoaders.push({
      loader: 'stylus-loader',
      options: {
        sourceMap: this.userConfig.styles.sourcemaps
      }
    })
    this.rules.push({
      test: /\.styl$/,
      use: styleLoaders
    })

    // nunjucks
    this.rules.push({
      test: /\.(html|njk|nunjucks)$/,
      use: [
        {
          loader: 'simple-nunjucks-loader',
          options: {
            searchPaths: [this.userConfig.paths.pages(), this.userConfig.paths.layouts(), this.userConfig.paths.components()]
          }
        }]
    })

    // Images and files
    this.rules.push({
      test: /\.(jpe?g|png|gif|svg|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
      use: ['file-loader']
    })

    // Shaders
    this.rules.push({
      test: /\.(vert|frag|glsl|shader|txt)$/i,
      use: ['raw-loader']
    })

    // Fonts
    this.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    })
  }

  setPlugins () {
    this.plugins = []

    // all HTMLWebpackPlugin
    this.createPages()

    // Copy static
    this.plugins.push(new CopyWebpackPlugin([this.userConfig.paths.static()]))

    // Zip dist
    if (this.userConfig.zipDist) {
      this.plugins.push(new ZipWebpackPlugin(this.userConfig.zipConfig))
    }

    // Clean dist
    if (this.userConfig.cleanDist) {
      this.plugins.push(new CleanWebpackPlugin([this.userConfig.paths.dist()], {
        root: this.userConfig.paths.base(),
        verbose: true
      }))
    }

    // Define variables
    const defineVariables = Object.keys(this.userConfig.provideVariables)
      .reduce((vars, varName) => {
        vars[varName] = JSON.stringify(this.userConfig.provideVariables[varName])
        return vars
      }, {})
    this.plugins.push(new webpack.DefinePlugin(defineVariables))

    // Define variables from .env file
    this.plugins.push(new Dotenv({
      silent: true
    }))

    // TODO: SVG sprite

    // Styles
    if (this.userConfig.styles.extract) {
      this.plugins.push(new MiniCssExtractPlugin({
        filename: this.userConfig.styles.outputName
      }))
    }

    // Critical CSS
    if (this.userConfig.styles.extractCriticalCss) {
      this.plugins.push(new Critters({
        preload: 'swap',
        preloadFonts: true
      }))
    }

    // Favicon
    if (this.userConfig.generateFavicon) {
      this.plugins.push(new FaviconsWebpackPlugin(this.userConfig.faviconConfig))
    }

    // Watch data files
    this.plugins.push(new ExtraWatchWebpackPlugin({
      files: [this.userConfig.paths.locales('**/*.js')]
    }))
  }

  createPages () {
    this.userConfig.pages.forEach(page => {
      this.plugins.push(new HtmlWebpackPlugin({
        filename: path.join(this.userConfig.paths.dist(), page.url, 'index.html'),
        template: page.source,
        templateParameters: () => {
          const t = this.userConfig.paths.locales('fr/index.js')

          delete require.cache[t]
          return require(t)
        }
      }))
    })
  }
}

module.exports = userConfig => {
  return new WebpackConfig(userConfig)
}
