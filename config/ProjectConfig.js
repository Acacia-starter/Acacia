/* eslint-disable no-console */
const path = require('path')
const glob = require('glob')
const defu = require('defu')
const packageJson = require('../package.json')
const acaciaConfig = require('../acacia.config')

const pathBase = path.resolve(__dirname, '..')

const AVAILABLE_STYLES_PREPROCESSORS = ['stylus', 'sass']

class ProjectConfig {
  constructor () {
    this.env = process.env.NODE_ENV || 'development'
    this.acaciaConfig = acaciaConfig
    this.setPaths()
    this.setBaseConfig()

    // If extendConfig is defined in config file, use it
    if (this.acaciaConfig.extendConfig) {
      this.acaciaConfig.extendConfig(this, {
        env: this.env,
        isProd: this.isProd(),
        isDev: this.isDev()
      })
    }

    // Create pages
    this.setPages()

    // If extendPage is defined in config file, use it
    if (this.acaciaConfig.extendPages) {
      this.acaciaConfig.extendPages(this.pages, {
        env: this.env,
        isProd: this.isProd(),
        isDev: this.isDev()
      })
    }
  }

  isProd () {
    return this.env === 'production'
  }

  isDev () {
    return this.env === 'development'
  }

  setPaths () {
    this.paths = {
      base: (...args) => path.resolve(pathBase, ...args),
      assets: (...args) => path.resolve(pathBase, 'assets', ...args),
      js: (...args) => path.resolve(pathBase, 'assets/js', ...args),
      styles: (...args) => path.resolve(pathBase, 'assets/styles', ...args),
      images: (...args) => path.resolve(pathBase, 'assets/img', ...args),
      videos: (...args) => path.resolve(pathBase, 'assets/videos', ...args),
      svg: (...args) => path.resolve(pathBase, 'assets/svg', ...args),
      static: (...args) => path.resolve(pathBase, 'static', ...args),
      dist: (...args) => path.resolve(pathBase, 'generate', ...args),
      pages: (...args) => path.resolve(pathBase, 'pages', ...args),
      layouts: (...args) => path.resolve(pathBase, 'layouts', ...args),
      components: (...args) => path.resolve(pathBase, 'components', ...args),
      locales: (...args) => path.resolve(pathBase, 'locales', ...args),
      archives: (...args) => path.resolve(pathBase, 'builds', ...args)
    }
  }

  setBaseConfig () {
    this.debug = this.acaciaConfig.debug || process.env.DEBUG
    this.baseUrl = this.acaciaConfig.baseUrl

    // Common
    this.cleanDist = this.isProd()
    this.devtool = this.isProd() ? false : 'cheap-module-eval-source-map'
    this.alias = {
      '~': this.paths.base(),
      '~a': this.paths.assets(),
      '~j': this.paths.js(),
      '~s': this.paths.styles(),
      '~i': this.paths.images(),
      '~v': this.paths.videos(),
      '~svg': this.paths.svg(),
      '~c': this.paths.components(),
      '~p': this.paths.pages(),
      '~l': this.paths.layouts()
    }

    this.provideVariables = Object.assign({}, {
      ENV: this.env
    }, this.acaciaConfig.env)

    // Metas
    this.metas = this.acaciaConfig.metas || {}

    // Locales
    this.locales = this.acaciaConfig.locales || [{ code: 'fr', iso: 'fr_FR' }]
    this.defaultLocale = this.acaciaConfig.defaultLocale || this.locales[0]

    // Pages
    this.indexPage = 'home'

    // Favicon (https://github.com/jantimon/favicons-webpack-plugin#advanced-usage + https://github.com/itgalaxy/favicons#usage)
    this.generateFavicon = this.isProd()
    this.faviconConfig = {
      logo: this.paths.assets('favicon.png'),
      inject: true,
      cache: true,
      prefix: 'favicons/',
      favicons: {
        appName: this.acaciaConfig.siteName || this.metas.title,
        appDescription: this.metas.description,
        lang: this.defaultLocale.iso,
        background: '#ddd',
        theme_color: '#333',
        logging: this.verbose,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          windows: true,
          yandex: false
        }
      }
    }

    // Js
    this.js = {
      minify: this.isProd(),
      entries: [this.paths.js('index.js')],
      eslint: true,
      eslintFix: true,
      outputName: this.isProd() ? 'assets/js/[name].[hash].js' : '[name].js',
      outputChunkName: this.isProd() ? 'assets/js/[name].[hash].js' : '[name].js',
      sourcemaps: true,
      externals: []
    }

    // Styles
    this.styles = {
      preprocessor: 'stylus',
      minify: this.isProd(),
      postcss: true,
      extract: this.isProd(),
      entries: [],
      outputName: this.isProd() ? 'assets/css/[name].[hash].css' : '[name].css',
      sourcemaps: true,
      extractCriticalCss: this.isProd()
    }

    // Files
    this.files = {
      outputName: this.isProd() ? '[path][name].[contenthash].[ext]' : '[name].[ext]'
    }

    // Views
    this.views = {
      minify: this.isProd()
    }

    // Webpack stats (https://webpack.js.org/configuration/stats/)
    this.stats = {
      assets: true,
      chunks: false,
      children: false,
      version: false,
      modules: false,
      builtAt: false,
      colors: true,
      hash: false,
      timings: false,
      entrypoints: false
    }

    // Zip (https://github.com/erikdesjardins/zip-webpack-plugin#usage)
    const date = new Date().toISOString().split('T')[0]
    this.zipDist = process.env.ZIP === 'true'
    this.zipConfig = {
      path: this.paths.archives(),
      filename: packageJson.name + '-' + date + '.zip',
      pathPrefix: ''
    }

    // Analyze (https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)
    this.analyzeBundle = process.env.ANALYZE === 'true'
    this.analyzeConfig = {
      logLevel: this.debug
    }

    // generateSitemap
    this.generateSitemap = this.isProd()

    // Dev server
    this.devServer = {
      host: '0.0.0.0',
      port: 5000,
      hot: true,
      stats: this.stats,
      clientLogLevel: 'silent',
      overlay: true
    }
  }

  /**
   * Get all pages infos used in build
   */
  setPages () {
    this.pages = []

    // Get all directory names in pages directory
    const pagesFolders = glob.sync('**/', {
      cwd: this.paths.pages(),
      mark: false
    })
      .map(directoryName => directoryName.replace(/\/$/, ''))

    this.locales.forEach(locale => {
      pagesFolders.forEach(pageName => {
        // construct URL from locale and page name
        const urlPath = []
        if (locale !== this.defaultLocale) {
          urlPath.push(locale.code)
        }
        if (pageName !== this.indexPage) {
          urlPath.push(pageName)
        }
        const url = '/' + urlPath.join('/')

        this.pages.push({
          source: this.paths.pages(pageName, 'index.html'),
          destination: this.paths.dist(`./${url}`, 'index.html'),
          url,
          locale: locale.code,
          datas: () => {
            const localeFilePath = this.paths.locales(locale.code, pageName, 'index.js')

            let localeFile = null

            try {
              // Try to require datas corresponding to the current locale and page name
              if (require.cache[localeFilePath]) delete require.cache[localeFilePath]
              localeFile = require(localeFilePath)
            } catch (err) {
              // Fallback to default locale
              if (locale !== this.defaultLocale) {
                const defaultlocaleFilePath = this.paths.locales(this.defaultLocale.code, pageName, 'index.js')
                if (this.debug) console.log(`Cannot find locale file ${localeFilePath}, try to require default locale file ${defaultlocaleFilePath}`)

                try {
                  if (require.cache[defaultlocaleFilePath]) delete require.cache[defaultlocaleFilePath]
                  localeFile = require(defaultlocaleFilePath)
                } catch (err) {}
              } else {
                if (this.debug) console.log(`Cannot find locale file ${localeFilePath}`)
              }
            }

            // Merge datas over env variables, default metas and current locale infos
            return defu(localeFile, {
              env: this.provideVariables,
              metas: this.metas,
              locale,
              currentUrl: url,
              baseUrl: this.baseUrl
            })
          }
        })
      })
    })
  }

  validate () {
    if (AVAILABLE_STYLES_PREPROCESSORS.indexOf(this.styles.preprocessor) === -1) {
      throw new Error(`${this.styles.preprocessor} is not a valid style preprocessor`)
    }
  }
}

module.exports = _ => {
  const c = new ProjectConfig()
  c.validate()
  return c
}
