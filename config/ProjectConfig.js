/* eslint-disable no-console */
const path = require('path')
const glob = require('glob')
const defu = require('defu')
const packageJson = require('../package.json')
const akaruConfig = require('../akaru.config')

const pathBase = path.resolve(__dirname, '..')

const AVAILABLE_STYLES_PREPROCESSORS = ['stylus', 'sass']

class ProjectConfig {
  constructor () {
    this.env = process.env.NODE_ENV || 'development'
    this.akaruConfig = akaruConfig
    this.setPaths()
    this.setBaseConfig()

    // If extendConfig is defined in config file, use it
    if (this.akaruConfig.extendConfig) {
      this.akaruConfig.extendConfig(this, {
        env: this.env,
        isProd: this.isProd(),
        isDev: this.isDev()
      })
    }

    // Create pages
    this.setPages()

    // If extendPage is defined in config file, use it
    if (this.akaruConfig.extendPages) {
      this.akaruConfig.extendPages(this.pages, {
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
    this.debug = this.akaruConfig.debug || process.env.DEBUG
    this.baseUrl = this.akaruConfig.baseUrl

    // common
    // TODO: sort them
    this.cleanDist = this.isProd()
    this.devtool = this.isProd() ? false : 'cheap-module-eval-source-map'
    this.externals = []
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
    }, this.akaruConfig.env)

    // Metas
    this.metas = this.akaruConfig.metas || {}

    // Locales
    this.locales = this.akaruConfig.locales || [{ code: 'fr', iso: 'fr_FR' }]
    this.defaultLocale = this.akaruConfig.defaultLocale || this.locales[0]

    // Pages
    this.indexPage = 'home'

    // Favicon
    this.generateFavicon = this.isProd()
    this.faviconConfig = {
      logo: this.paths.assets('favicon.png'),
      inject: true,
      title: this.metas.siteName
    }

    // Js
    this.js = {
      minify: this.isProd(),
      entries: [this.paths.js('index.js')],
      eslint: true,
      eslintFix: true,
      outputName: this.isProd() ? '[name].[hash].js' : '[name].js',
      outputChunkName: this.isProd() ? '[name].[hash].js' : '[name].js',
      sourcemaps: true
    }

    // Styles
    this.styles = {
      preprocessor: 'stylus',
      minify: this.isProd(),
      postcss: true,
      extract: this.isProd(),
      entries: [],
      outputName: this.isProd() ? '[name].[hash].css' : '[name].css',
      sourcemaps: true,
      extractCriticalCss: this.isProd()
    }

    // Views
    this.views = {
      minify: this.isProd()
    }

    // Webpack stats
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

    // Zip
    const date = new Date().toISOString().split('T')[0]
    this.zipDist = process.env.ZIP === 'true'
    this.zipConfig = {
      path: this.paths.archives(),
      filename: packageJson.name + '-' + date + '.zip',
      pathPrefix: ''
    }

    // Analyze
    this.analyzeBundle = process.env.ANALYZE === 'true'
    this.analyzeConfig = {}

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
              url,
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
