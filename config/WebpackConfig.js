const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const glob = require('glob')
const deepmerge = require('deepmerge')
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
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const Critters = require('critters-webpack-plugin')

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
          '~p': this.userConfig.paths.pages(),
          '~l': this.userConfig.paths.layouts
        }, this.userConfig.alias)
      },
      resolveLoader: {
        modules: [path.resolve(__dirname, 'webpack-loaders'), 'node_modules'],
        extensions: ['.js', '.json'],
        mainFields: ['loader', 'main']
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
            fix: true
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

    // nunjucks
    this.rules.push({
      test: /\.html$|njk|nunjucks/,
      use: ['html-loader', {
        loader: 'nunjucks-html-loader'
        // options: {
        // searchPaths: [this.userConfig.paths.pages(), this.userConfig.paths.layouts, this.userConfig.paths.components]
        // context: {
        //   username: 'quentin'
        // }
        // }
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
    // all HTMLWebpackPlugin
    this.createPages()

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

    this.plugins.push(new webpack.DefinePlugin(this.userConfig.provideVariables))

    // TODO: SVG sprite

    // Styles
    if (this.userConfig.styles.extract) {
      this.plugins.push(new MiniCssExtractPlugin({
        filename: this.userConfig.styles.outputName
      }))
    }

    // Critical CSS
    if (this.userConfig.isProduction()) {
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
      files: [this.userConfig.paths.pages('**/datas.js')]
    }))

    // HMR
    this.plugins.push(new webpack.HotModuleReplacementPlugin())

    this.updateConfig()
  }

  getDatasFromFile (filePath, lang) {
    let datas = {}
    if (fs.existsSync(filePath)) {
      datas = require(filePath)['default']()
    }

    datas = deepmerge(datas, datas.i18n[lang] || {})
    delete datas['i18n']
    return datas
  }

  createPagesInfos () {
    const pagesFolders = glob.sync('**/', {
      cwd: this.userConfig.paths.pages()
    })

    this.userConfig.langs.forEach(lang => {
      pagesFolders.forEach(pageName => {
        // Construct datas
        let datasFilePath = this.userConfig.paths.pages(pageName, 'datas.js')
        let datas = this.getDatasFromFile(datasFilePath, lang)

        // construct URL
        let url = ''
        if (lang !== this.userConfig.defaultLang) {
          url += `/${lang}`
        }

        if (datas.metas && typeof datas.metas.url === 'string') {
          url += `/${datas.metas.url}`
        } else if (pageName !== this.userConfig.indexPage) {
          url += `/${pageName}`
        }

        this.pages.push({
          source: path.resolve(this.userConfig.paths.pages(), pageName, 'index.njk'),
          url,
          pageDatas: () => {
            let datasFilePath = this.userConfig.paths.pages(pageName, 'datas.js')
            delete require.cache[datasFilePath]

            return this.getDatasFromFile(datasFilePath, lang)
          }
        })
      })
    })

    if (overridePages) {
      overridePages(this.pages)
    }
  }

  createPages () {
    this.pages.forEach(page => {
      let t = JSON.stringify({
        searchPaths: [this.userConfig.paths.pages(), this.userConfig.paths.layouts, this.userConfig.paths.components],
        context: page.pageDatas()
      })

      this.plugins.push(new HtmlWebpackPlugin({
        filename: path.join(this.userConfig.paths.dist, page.url, 'index.html'),
        alwaysWriteToDisk: true,
        cache: false,
        template: '!!html-loader!nunjucks-html-loader?' + t + '!' + page.source
      }))
    })

    this.plugins.push(new HtmlWebpackHarddiskPlugin())
  }
}

module.exports = WebpackConfig
