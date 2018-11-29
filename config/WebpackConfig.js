const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
// Custom overrides
const { overridePages } = require('../akaru.config')
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

class WebpackConfig {
  constructor (userConfig) {
    this.userConfig = userConfig
    this.config = {}

    this.pages = []
    this.rules = []
    this.plugins = []

    this.createPagesInfos()
    this.setRules()
    this.setPlugins()
    this.updateConfig()
  }

  updateConfig () {
    this.config = {
      mode: this.userConfig.env,
      entry: this.userConfig.js.entriesFile,
      output: {
        path: this.userConfig.paths.dist,
        filename: this.userConfig.js.outputName,
        chunkFilename: this.userConfig.js.outputChunkName
      },
      module: {
        rules: this.rules
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.scss', '.css'],
        alias: Object.assign({}, {
          '~': this.userConfig.paths.base,
          '~j': this.userConfig.paths.js,
          '~s': this.userConfig.paths.styles,
          '~i': this.userConfig.paths.images,
          '~c': this.userConfig.paths.components,
          '~p': this.userConfig.paths.pages,
          '~l': this.userConfig.paths.layouts
        }, this.userConfig.alias)
      },
      devtool: this.userConfig.devtool,
      context: this.userConfig.paths.base,
      target: 'web',
      externals: this.userConfig.externals,
      stats: this.userConfig.stats,
      devServer: this.userConfig.devServer,
      plugins: this.plugins
    }
  }

  setRules () {
    // Js
    this.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    })

    // Eslint
    if (this.userConfig.js.eslint) {
      this.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
        enforce: 'pre'
      })
    }

    // Styles
    const styleLoaders = []
    if (this.userConfig.styles.extract) {
      styleLoaders.push(MiniCssExtractPlugin.loader)
    } else {
      styleLoaders.push('style-loader')
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
      loader: 'sass-loader',
      options: {
        sourceMap: this.userConfig.styles.sourcemaps
      }
    })
    this.rules.push({
      test: /\.(sa|sc|c)ss$/,
      use: styleLoaders
    })

    // Pug
    this.rules.push({
      test: /.pug$/,
      use: [{
        loader: 'pug-loader',
        options: {
          root: this.userConfig.paths.base,
          pretty: !this.userConfig.views.minify
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
    // Copy static
    this.plugins.push(new CopyWebpackPlugin([this.userConfig.paths.static]))

    // Zip dist
    if (this.userConfig.zipDist) {
      this.plugins.push(new ZipWebpackPlugin(this.userConfig.zipConfig))
    }

    // Clean dist
    if (this.userConfig.cleanDist) {
      this.plugins.push(new CleanWebpackPlugin([this.userConfig.paths.dist], {
        root: this.userConfig.paths.base,
        verbose: true
      }))
    }

    this.plugins.push(new webpack.DefinePlugin({
      ENV: this.userConfig.env,
      ...this.userConfig.provideVariables
    }))

    // TODO: SVG sprite

    // Styles
    if (this.userConfig.styles.extract) {
      this.plugins.push(new MiniCssExtractPlugin({
        filename: this.userConfig.styles.outputName
      }))
    }

    // Favicon
    if (this.userConfig.generateFavicon) {
      this.plugins.push(new FaviconsWebpackPlugin(this.userConfig.faviconConfig))
    }

    // Watch data files
    this.plugins.push(new ExtraWatchWebpackPlugin({
      files: [path.join(this.userConfig.paths.pages, '**/data.js')]
    }))

    // all HTMLWebpackPlugin
    this.createPages()
    this.updateConfig()
  }

  createPagesInfos () {
    const pagesFolders = fs.readdirSync(this.userConfig.paths.pages)

    this.userConfig.langs.forEach(lang => {
      pagesFolders.forEach(pageName => {
        // construct URL
        let url = ''
        if (lang !== this.userConfig.defaultLang) {
          url += `/${lang}`
        }
        if (pageName !== this.userConfig.indexPage) {
          url += `/${pageName}`
        }

        // Construct datas
        let datas = {
          pageName: 'Test'
        }
        // delete require.cache[paths.views('pages', pageName, 'data.js')]
        //   delete require.cache[paths.views('data.js')]

        //   let page = require(paths.views('pages', pageName, 'data.js'))['default']()
        //   let base = require(paths.views('data.js'))['default']()

        this.pages.push({
          source: path.resolve(this.userConfig.paths.pages, pageName, 'index.pug'),
          url,
          datas
        })
      })
    })

    if (overridePages) {
      overridePages(this.pages)
    }
  }

  createPages () {
    this.pages.forEach(page => {
      this.plugins.push(new HtmlWebpackPlugin({
        filename: path.join(this.userConfig.paths.dist, page.url, 'index.html'),
        cache: false,
        template: page.source,
        templateParameters: page.datas
      }))
    })
  }
}

module.exports = WebpackConfig
