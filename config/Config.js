const path = require('path')

const pathBase = path.resolve(__dirname, '..')

class Config {
  constructor (env) {
    this.env = env
    this.setConfig()

    if (this.env === 'production') {
      this.setProductionConfig()
    }

    if (process.env.ZIP || false) {
      this.setZipConfig()
    }
  }

  isProduction () {
    return this.env === 'production'
  }

  setConfig () {
    // Paths
    this.paths = {
      base: pathBase,
      assets: path.resolve(pathBase, 'assets'),
      js: path.resolve(pathBase, 'assets/js'),
      styles: path.resolve(pathBase, 'assets/styles'),
      images: path.resolve(pathBase, 'assets/img'),
      svg: path.resolve(pathBase, 'assets/svg'),
      svgSprite: path.resolve(pathBase, 'assets/svg/sprite'),
      static: path.resolve(pathBase, 'static'),
      dist: path.resolve(pathBase, 'generate'),
      pages: (...args) => path.resolve(pathBase, 'pages', ...args),
      layouts: path.resolve(pathBase, 'layouts'),
      components: path.resolve(pathBase, 'components')
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
      logo: path.resolve(this.paths.assets, 'favicon.png'),
      inject: true,
      title: 'Akaru Starter'
    }

    // Js
    this.js = {
      minify: false,
      entriesFile: [path.resolve(this.paths.js, 'index.js')],
      eslint: true,
      outputName: '[name].js',
      outputChunkName: '[name].js',
      sourcemaps: true
    }
    if (this.env === 'development') {
      this.js.entriesFile.push(`webpack-dev-server/client?http://${this.host}:${this.port}/`)
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
    // TODO : true
    this.generateFavicon = false
    this.cleanDist = true
    this.devtool = false
    this.js.outputName = '[name].[chunkhash].js'
    this.js.outputChunkName = '[name].[chunkhash].js'
    this.js.minify = true
    this.styles.outputName = '[name].[chunkhash].css'
    this.styles.minify = true
    this.styles.extract = true
    this.views.minify = true
  }

  setZipConfig () {
    this.zipDist = true
  }
}

module.exports = Config
