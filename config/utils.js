require('@babel/register')

const { overrideConfig, overrideWebpackConfig, overridePages } = require('../akaru.config')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const defu = require('defu')

const getUserConfig = () => {
  const Config = require('./Config')
  const env = process.env.NODE_ENV || 'production'

  let config = new Config(env)

  if (overrideConfig) {
    config = overrideConfig(config, { env })

    if (!config) {
      console.warn('\x1b[31m%s\x1b[0m', 'You need to return your config in overrideConfig method')
      process.exit(0)
    }
  }

  return config
}

const getWebpackConfig = (userConfig = null) => {
  const WebpackConfig = require('./WebpackConfig')
  const env = process.env.NODE_ENV || 'production'
  if (!userConfig) userConfig = getUserConfig()

  let webpackConfig = new WebpackConfig(userConfig)

  if (overrideWebpackConfig) {
    webpackConfig = overrideWebpackConfig(webpackConfig, { userConfig, env })

    if (!webpackConfig) {
      console.warn('\x1b[31m%s\x1b[0m', 'You need to return your webpackConfig in overrideWebpackConfig method')
      process.exit(0)
    }
  }

  return webpackConfig
}

const getDatasFromFile = (filePath, lang) => {
  let datas = {}
  if (fs.existsSync(filePath)) {
    datas = require(filePath)['default']()
  }

  datas = defu(datas, datas.i18n[lang] || {})
  delete datas['i18n']
  return datas
}

const getPages = (userConfig = null) => {
  if (!userConfig) userConfig = getUserConfig()

  let pages = []

  const pagesFolders = glob.sync('**/', {
    cwd: userConfig.paths.pages()
  })

  userConfig.langs.forEach(lang => {
    pagesFolders.forEach(pageName => {
      // Construct datas
      let datasFilePath = userConfig.paths.pages(pageName, 'datas.js')
      let datas = getDatasFromFile(datasFilePath, lang)

      // construct URL
      let url = ''
      if (lang !== userConfig.defaultLang) {
        url += `/${lang}`
      }

      if (datas.metas && typeof datas.metas.url === 'string') {
        url += `/${datas.metas.url}`
      } else if (pageName !== this.userConfig.indexPage) {
        url += `/${pageName}`
      }

      pages.push({
        source: path.resolve(userConfig.paths.pages(), pageName, 'index.njk'),
        lang,
        metas: datas.metas,
        url,
        getPageDatas: () => {
          let datasFilePath = userConfig.paths.pages(pageName, 'datas.js')
          delete require.cache[datasFilePath]

          return getDatasFromFile(datasFilePath, lang)
        }
      })
    })
  })

  if (overridePages) {
    pages = overridePages(pages)

    if (!Array.isArray(pages)) {
      console.warn('\x1b[31m%s\x1b[0m', 'You need to return your pages in overridePages method')
      process.exit(0)
    }
  }

  return pages
}

module.exports = {
  getUserConfig,
  getWebpackConfig,
  getPages
}
