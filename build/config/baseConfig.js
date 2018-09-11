export default {
  name: 'Akaru starter',
  langs: ['en', 'fr'],
  defaultLang: 'fr',
  index: 'home',
  dist: 'generate',
  zip: true,
  cleanBeforeBuild: true,
  devtool: false,
  favicon: 'src/favicon.jpg',
  js: {
    minify: true,
    entries: ['src/js/index.js'],
    eslint: true,
    outputName: '[name].[hash].js',
    sourcemaps: false
  },
  styles: {
    minify: true,
    postcss: true,
    entries: [],
    outputName: '[name].[hash].css',
    sourcemaps: false
  },
  views: {
    minify: true,
    path: 'views/',
    pagesPath: 'views/pages/',
    blocksPath: 'views/blocks/',
    partialsPath: 'views/partials/'
  },
  datas: {
    path: 'template/**/data.js',
    filename: 'data.js'
  },
  svg: {
    svgo: true,
    sprite: true,
    svgSpritePath: 'src/svg/sprite/*.svg',
    spriteFilename: '../views/commons/sprite.[hash].svg'
  },
  webpackStats: {
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
  },
  envs: {
    development: {
      filenames: {
        js: '[name].js',
        styles: '[name].css'
      },
      cleanBeforeBuild: false,
      zip: false,
      devtool: 'cheap-module-eval-source-map',
      port: '5000',
      sourcemaps: true,
      minifyHtml: false,
      minifyCss: false,
      minifyJs: false
    }
  }
}
