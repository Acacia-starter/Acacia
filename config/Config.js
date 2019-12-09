const path = require('path')
const glob = require('glob')
const packageJson = require('../package.json')
const akaruConfig = require('../akaru.config')

const pathBase = path.resolve(__dirname, '..')

class Config {
  constructor () {
    this.env = process.env.NODE_ENV || 'development'
    this.akaruConfig = akaruConfig
    this.setPaths()
    this.setBaseConfig()

    if (this.akaruConfig.extendConfig) {
      this.akaruConfig.extendConfig(this, { env: this.env, isProd: this.isProduction(), isDev: this.isDevelopment() })
    }

    this.setPages()

    if (this.akaruConfig.extendPages) {
      this.akaruConfig.extendPages(this.pages, { env: this.env, isProd: this.isProduction(), isDev: this.isDevelopment() })
    }
  }

  isProduction () {
    return this.env === 'production'
  }

  isDevelopment () {
    return this.env === 'development'
  }

  setPaths () {
    this.paths = {
      base: (...args) => path.join(pathBase, ...args),
      assets: (...args) => path.join(pathBase, 'assets', ...args),
      js: (...args) => path.join(pathBase, 'assets/js', ...args),
      styles: (...args) => path.join(pathBase, 'assets/styles', ...args),
      images: (...args) => path.join(pathBase, 'assets/img', ...args),
      svg: (...args) => path.join(pathBase, 'assets/svg', ...args),
      svgSprite: (...args) => path.join(pathBase, 'assets/svg/sprite', ...args),
      static: (...args) => path.join(pathBase, 'static', ...args),
      dist: (...args) => path.join(pathBase, 'generate', ...args),
      pages: (...args) => path.join(pathBase, 'pages', ...args),
      layouts: (...args) => path.join(pathBase, 'layouts', ...args),
      components: (...args) => path.join(pathBase, 'components', ...args),
      locales: (...args) => path.join(pathBase, 'locales', ...args),
      archives: (...args) => path.join(pathBase, 'builds', ...args)
    }
  }

  setBaseConfig () {
    // Langs
    this.langs = this.akaruConfig.langs
    this.defaultLang = this.akaruConfig.defaultLang || this.akaruConfig.langs[0]

    // Pages
    this.indexPage = 'home'

    // Favicon
    this.generateFavicon = this.isProduction()
    this.faviconConfig = {
      logo: this.paths.assets('favicon.png'),
      inject: true,
      title: 'Akaru Starter'
    }

    // Js
    this.js = {
      minify: this.isProduction(),
      entries: [this.paths.js('index.js')],
      eslint: true,
      eslintFix: true,
      outputName: this.isProduction() ? '[name].[hash].js' : '[name].js',
      outputChunkName: this.isProduction() ? '[name].[hash].js' : '[name].js',
      sourcemaps: true
    }

    // common
    this.cleanDist = this.isProduction()
    this.devtool = this.isProduction() ? false : 'cheap-module-eval-source-map'
    this.externals = []
    this.alias = {}
    this.provideVariables = Object.assign({}, {
      ENV: this.env
    }, this.akaruConfig.env)

    // Styles
    this.styles = {
      minify: this.isProduction(),
      postcss: true,
      extract: this.isProduction(),
      entries: [],
      outputName: this.isProduction() ? '[name].[hash].css' : '[name].css',
      sourcemaps: true,
      extractCriticalCss: this.isProduction()
    }

    // Views
    this.views = {
      minify: this.isProduction()
    }

    // SVG
    this.svg = {
      svgo: true,
      sprite: true,
      svgSpritePath: 'src/svg/sprite/*.svg',
      spriteFilename: '../views/commons/sprite.[hash].svg'
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
    this.zipDist = process.env.ZIP === true
    this.zipConfig = {
      path: this.paths.archives(),
      filename: packageJson.name + '-' + date + '.zip',
      pathPrefix: ''
    }

    // Dev server
    this.devServer = {
      host: '0.0.0.0',
      port: 5000,
      stats: this.stats
    }
  }

  setPages () {
    this.pages = []

    const pagesFolders = glob.sync('**/', {
      cwd: this.paths.pages(),
      mark: false
    })
      .map(directoryName => directoryName.replace(/\/$/, ''))

    this.langs.forEach(lang => {
      pagesFolders.forEach(pageName => {
        // construct URL
        const urlPath = []
        if (lang !== this.defaultLang) {
          urlPath.push(lang)
        }
        if (pageName !== this.indexPage) {
          urlPath.push(pageName)
        }

        const url = '/' + urlPath.join('/')

        this.pages.push({
          source: this.paths.pages(pageName, 'index.html'),
          destination: this.paths.dist(url, 'index.html'),
          url,
          lang,
          datas: () => {
            const localeFilePath = this.paths.locales(lang, 'index.js')
            delete require.cache[localeFilePath]

            try {
              return require(localeFilePath)
            } catch (e) {
              return {}
            }
          }
        })
      })
    })
  }
}

module.exports = _ => {
  return new Config()
}
