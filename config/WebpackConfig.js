/* eslint-disable no-console */
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
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default

class WebpackConfig {
  constructor (projectConfig) {
    this.projectConfig = projectConfig

    this.setRules()
    this.setPlugins()
    this.setConfig()

    if (akaruConfig.extendWebpackConfig) {
      akaruConfig.extendWebpackConfig(this.config, {
        env: this.projectConfig.env,
        isProd: this.projectConfig.isProd(),
        isDev: this.projectConfig.isDev()
      })
    }
  }

  setConfig () {
    this.config = {
      mode: this.getWebpackMode(),
      entry: [...this.projectConfig.js.entries, ...this.projectConfig.styles.entries],
      output: {
        path: this.projectConfig.paths.dist(),
        filename: this.projectConfig.js.outputName,
        chunkFilename: this.projectConfig.js.outputChunkName
      },
      module: {
        rules: this.rules
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json'],
        alias: this.projectConfig.alias
      },
      devtool: this.projectConfig.devtool,
      context: this.projectConfig.paths.base(),
      target: 'web',
      externals: this.projectConfig.js.externals,
      stats: this.projectConfig.stats,
      devServer: this.projectConfig.devServer,
      plugins: this.plugins
    }

    if (this.projectConfig.js.minify || this.projectConfig.styles.minify) {
      const minimizer = []

      if (this.projectConfig.js.minify) {
        minimizer.push(new TerserJSPlugin())
      }
      if (this.projectConfig.styles.minify) {
        minimizer.push(new OptimizeCSSAssetsPlugin())
      }

      this.config.optimization = {
        minimizer
      }
    }
  }

  /**
   * Get Webpack mode config
   *
   * Only development and production are valids
   *
   * @return {string} - webpack mode
   */
  getWebpackMode () {
    if (['development', 'production'].indexOf(this.projectConfig.env) > -1) {
      return this.projectConfig.env
    }

    return 'none'
  }

  setRules () {
    this.rules = []

    // Js
    this.rules.push({
      test: /\.js$/,
      exclude: /(node_modules|config)/,
      use: [
        'babel-loader'
      ]
    })

    // Eslint
    if (this.projectConfig.js.eslint) {
      this.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'eslint-loader',
          options: {
            fix: this.projectConfig.js.eslintFix
          }
        }],
        enforce: 'pre'
      })
    }

    // Styles
    const styleLoaders = []
    if (this.projectConfig.styles.extract) {
      styleLoaders.push({
        loader: MiniCssExtractPlugin.loader
      })
    } else {
      styleLoaders.push({
        loader: 'style-loader'
      })
    }
    styleLoaders.push({
      loader: 'css-loader',
      options: {
        sourceMap: this.projectConfig.styles.sourcemaps
      }
    })
    if (this.projectConfig.styles.postcss) {
      styleLoaders.push({
        loader: 'postcss-loader',
        options: {
          sourceMap: this.projectConfig.styles.sourcemaps
        }
      })
    }

    if (this.projectConfig.styles.preprocessor === 'stylus') {
      styleLoaders.push({
        loader: 'stylus-loader',
        options: {
          sourceMap: this.projectConfig.styles.sourcemaps
        }
      })
      this.rules.push({
        test: /\.styl$/,
        use: styleLoaders
      })
    }

    if (this.projectConfig.styles.preprocessor === 'sass') {
      styleLoaders.push({
        loader: 'sass-loader',
        options: {
          sourceMap: this.projectConfig.styles.sourcemaps
        }
      })
      this.rules.push({
        test: /\.s[ac]ss$/i,
        use: styleLoaders
      })
    }

    // nunjucks
    this.rules.push({
      test: /\.(html|njk|nunjucks)$/,
      use: [
        {
          loader: 'simple-nunjucks-loader',
          options: {
            searchPaths: [this.projectConfig.paths.pages(), this.projectConfig.paths.layouts(), this.projectConfig.paths.components()],
            assetsPaths: [this.projectConfig.paths.assets()],
            globals: require('./nunjucks-functions'),
            filters: require('./nunjucks-filters')
          }
        }]
    })

    // Images and files
    this.rules.push({
      test: /\.(jpe?g|png|gif|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: this.projectConfig.files.outputName
        }
      }]
    })

    // SVGs
    // All SVGs files are cleaned by SVGO unless you specify otherwise
    this.rules.push({
      test: /\.svg$/,
      oneOf: [{
        resourceQuery: /raw/,
        use: [ {
          loader: 'raw-loader',
          options: {
            esModule: false
          }
        }]
      }, {
        use: [{
          loader: 'raw-loader',
          options: {
            esModule: false
          }
        }, {
          loader: 'svgo-loader',
          options: {
            externalConfig: 'svgo-config.json'
          }
        }]
      }]
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
    this.plugins.push(new CopyWebpackPlugin([
      this.projectConfig.paths.static()
    ], {
      logLevel: this.projectConfig.debug ? 'info' : 'silent'
    }))

    // Zip dist
    if (this.projectConfig.zipDist) {
      this.plugins.push(new ZipWebpackPlugin(this.projectConfig.zipConfig))
    }

    // Analyze bundle
    if (this.projectConfig.analyzeBundle) {
      this.plugins.push(new BundleAnalyzerPlugin(this.projectConfig.analyzeConfig))
    }

    // Sitemap
    if (this.projectConfig.generateSitemap && this.projectConfig.baseUrl) {
      const paths = this.projectConfig.pages.map(page => page.url)

      this.plugins.push(new SitemapWebpackPlugin(this.projectConfig.baseUrl, paths))
    }

    // Clean dist
    if (this.projectConfig.cleanDist) {
      this.plugins.push(new CleanWebpackPlugin([this.projectConfig.paths.dist()], {
        root: this.projectConfig.paths.base(),
        verbose: this.projectConfig.debug
      }))
    }

    // Define variables
    const defineVariables = Object.keys(this.projectConfig.provideVariables)
      .reduce((vars, varName) => {
        vars[varName] = JSON.stringify(this.projectConfig.provideVariables[varName])
        return vars
      }, {})
    this.plugins.push(new webpack.DefinePlugin(defineVariables))

    // Define variables from .env file
    this.plugins.push(new Dotenv({
      silent: !this.projectConfig.debug
    }))

    // Styles
    if (this.projectConfig.styles.extract) {
      this.plugins.push(new MiniCssExtractPlugin({
        filename: this.projectConfig.styles.outputName
      }))
    }

    // Critical CSS
    if (this.projectConfig.styles.extractCriticalCss) {
      this.plugins.push(new Critters({
        preload: 'swap',
        preloadFonts: true
      }))
    }

    // Favicon
    if (this.projectConfig.generateFavicon) {
      this.plugins.push(new FaviconsWebpackPlugin(this.projectConfig.faviconConfig))
    }

    // Watch data files
    this.plugins.push(new ExtraWatchWebpackPlugin({
      files: [this.projectConfig.paths.locales('**/*.js')]
    }))
  }

  createPages () {
    this.projectConfig.pages.forEach(page => {
      this.plugins.push(new HtmlWebpackPlugin({
        filename: page.destination,
        template: page.source,
        templateParameters: page.datas || {}
      }))
    })
  }
}

module.exports = projectConfig => {
  return new WebpackConfig(projectConfig)
}
