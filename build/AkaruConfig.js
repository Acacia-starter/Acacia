import deepmerge from 'deepmerge'

// TODO: regrouper par type ? js, css
const BASE_CONFIG = {
  name: 'Akaru starter',
  langs: ['en', 'fr'],
  defaultLang: 'fr',
  index: 'home',
  devtool: false,
  favicon: 'src/favicon.jpg',
  zip: false,
  cleanBeforeBuild: false,
  sourcemaps: true,
  // TODO: Minifier ou non suivant config
  minifyHtml: true,
  minifyCss: true,
  minifyJs: true,
  svgSprite: {
    active: true,
    filename: '../views/commons/sprite.[hash].svg'
  },
  filenames: {
    js: '[name].js',
    styles: '[name].css'
  },
  postcss: true,
  eslint: true,
  paths: {
    js: 'src/js',
    styles: 'src/styles',
    svg: 'src/svg',
    views: 'views',
    dist: 'generate',
    static: 'static'
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
    production: {
      zip: true,
      cleanBeforeBuild: true,
      sourcemaps: false,
      filenames: {
        js: '[name].[hash].js',
        styles: '[name].[hash].css'
      }
    },
    development: {
      devtool: 'cheap-module-eval-source-map',
      port: '5000',
      minifyHtml: false,
      minifyCss: false,
      minifyJs: false
    }
  }
}

export default (userAkaruConfig, env) => {
  let akaruConfigEnvs = userAkaruConfig.envs
  // akaruConfig = userAkaruConfig without envs key
  let { envs, ...akaruConfig } = userAkaruConfig

  let baseConfigsEnvs = BASE_CONFIG.envs
  // baseConfig = BASE_CONFIG without envs key
  let { envs: test, ...baseConfig } = BASE_CONFIG

  const merges = [baseConfig, baseConfigsEnvs[env], akaruConfig]

  if (akaruConfigEnvs && akaruConfigEnvs[env]) {
    merges.push(akaruConfigEnvs[env])
  }

  return deepmerge.all(merges)
}
