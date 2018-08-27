import deepmerge from 'deepmerge'

const BASE_CONFIG = {
  name: 'Akaru starter',
  index: 'home',
  devtool: false,
  favicon: 'src/favicon.png',
  zip: false,
  cleanBeforeBuild: false,
  sourcemaps: true,
  svgSprite: {
    active: true,
    filename: 'views/commons/sprite.svg'
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
    modules: false
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
      port: '5000'
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
