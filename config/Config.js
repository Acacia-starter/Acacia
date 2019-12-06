const path = require('path')

const pathBase = path.resolve(__dirname, '..')

class Config {
  constructor (env) {
    this.env = env
    this.setConfig()

    if (this.isProduction()) {
      this.setProductionConfig()
    }

    if (process.env.ZIP) {
      this.zipDist = true
    }
  }

  isProduction () {
    return this.env === 'production'
  }

  isDevelopment () {
    return this.env === 'development'
  }

  setConfig () {
    // Paths
    this.paths = {
      base: pathBase,
      assets: (...args) => path.resolve(pathBase, 'assets', ...args),
      js: (...args) => path.resolve(pathBase, 'assets/js', ...args),
      styles: (...args) => path.resolve(pathBase, 'assets/styles', ...args),
      images: (...args) => path.resolve(pathBase, 'assets/img', ...args),
      svg: (...args) => path.resolve(pathBase, 'assets/svg', ...args),
      svgSprite: (...args) => path.resolve(pathBase, 'assets/svg/sprite', ...args),
      static: (...args) => path.resolve(pathBase, 'static', ...args),
      dist: (...args) => path.resolve(pathBase, 'generate', ...args),
      pages: (...args) => path.resolve(pathBase, 'pages', ...args),
      layouts: (...args) => path.resolve(pathBase, 'layouts', ...args),
      components: (...args) => path.resolve(pathBase, 'components', ...args)
    }

    // Common informations
    this.name = 'Akaru starter'
    this.port = 5000
    this.host = '0.0.0.0'

    // Langs
    this.langs = ['en', 'fr']
    this.defaultLang = 'fr'

    // Pages
    this.indexPage = 'home'

    // Favicon
    this.generateFavicon = false
    this.faviconConfig = {
      logo: this.paths.assets('favicon.png'),
      inject: true,
      title: 'Akaru Starter'
    }

    // Js
    this.js = {
      minify: false,
      entriesFile: [this.paths.js('index.js')],
      eslint: true,
      outputName: '[name].js',
      outputChunkName: '[name].js',
      sourcemaps: true
    }

    this.devtool = 'cheap-module-eval-source-map'
    this.externals = []
    this.alias = {}
    this.provideVariables = {
      ENV: JSON.stringify(this.env)
    }

    // Styles
    this.styles = {
      minify: false,
      postcss: true,
      extract: false,
      entries: [],
      outputName: '[name].css',
      sourcemaps: true
    }

    // Views
    this.views = {
      minify: false
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
    this.zipDist = false
    this.zipConfig = {
      path: this.paths.base,
      filename: 'generate.zip',
      pathPrefix: ''
    }

    // Dev server
    this.devServer = {
      host: this.host,
      port: this.port,
      stats: this.stats
    }
  }

  setProductionConfig () {
    this.generateFavicon = false
    this.cleanDist = true
    this.devtool = false
    this.js.outputName = '[name].[hash].js'
    this.js.outputChunkName = '[name].[hash].js'
    this.js.minify = true
    this.styles.outputName = '[name].[hash].css'
    this.styles.minify = true
    this.styles.extract = true
    this.views.minify = true
  }
}

module.exports = Config
