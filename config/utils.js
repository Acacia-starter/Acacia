require('@babel/register')

const { overrideConfig, overrideWebpackConfig, overridePages } = require('../akaru.config')
const glob = require('glob')
const fs = require('fs')
const defu = require('defu')

const getUserConfig = () => {
  const Config = require('./Config')
  const env = process.env.NODE_ENV || 'production'

  let config = new Config(env)

  if (overrideConfig) {
    config = overrideConfig(config)

    if (!config) {
      console.warn('\x1b[31m%s\x1b[0m', 'You need to return your config in overrideConfig method')
      process.exit(0)
    }
  }

  return config
}

const getWebpackConfig = (userConfig = null) => {
  const WebpackConfig = require('./WebpackConfig')
  if (!userConfig) userConfig = getUserConfig()

  let webpackConfig = new WebpackConfig(userConfig)

  if (overrideWebpackConfig) {
    webpackConfig = overrideWebpackConfig(webpackConfig, { userConfig })

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

  datas = defu(datas, (datas.i18n && datas.i18n[lang]) || {})
  delete datas['i18n']
  return datas
}

const getPages = (userConfig = null) => {
  if (!userConfig) userConfig = getUserConfig()

  let pages = []

  const pagesFolders = glob.sync('**/', {
    cwd: userConfig.paths.pages(),
    mark: false
  })
    .map(directoryName => directoryName.replace(/\/$/, ''))

  userConfig.langs.forEach(lang => {
    pagesFolders.forEach(pageName => {
      // Construct datas
      let pageDatasFilePath = userConfig.paths.pages(pageName, 'datas.js')
      let pageDatas = getDatasFromFile(pageDatasFilePath, lang)
      let generalDatasFilePath = userConfig.paths.layouts('datas.js')
      let generalDatas = getDatasFromFile(generalDatasFilePath, lang)

      let datas = defu(generalDatas, pageDatas)

      // construct URL
      let url = ''
      if (lang !== userConfig.defaultLang) {
        url += `/${lang}`
      }

      if (datas.metas && typeof datas.metas.url === 'string') {
        url += `/${datas.metas.url}`
      } else if (pageName !== userConfig.indexPage) {
        url += `/${pageName}`
      }

      pages.push({
        source: userConfig.paths.pages(pageName, 'index.html'),
        url,
        getPageDatas: () => {
          let pageDatasFilePath = userConfig.paths.pages(pageName, 'datas.js')
          let generalDatasFilePath = userConfig.paths.layouts('datas.js')
          delete require.cache[pageDatasFilePath]
          delete require.cache[generalDatasFilePath]

          return defu(getDatasFromFile(generalDatasFilePath, lang), getDatasFromFile(pageDatasFilePath, lang))
        }
      })
    })
  })

  if (overridePages) {
    pages = overridePages(pages, { userConfig })

    // Check all pages are correct
    pages.forEach(page => {
      if (!(typeof page.url === 'string')) {
        console.warn('\x1b[31m%s\x1b[0m', `This page has an incorrect url parameter`, page)
        process.exit(0)
      }

      if (!page.source || !(typeof page.source === 'string')) {
        console.warn('\x1b[31m%s\x1b[0m', `This page has an incorrect source parameter`, page)
        process.exit(0)
      }
    })

    if (!Array.isArray(pages)) {
      console.warn('\x1b[31m%s\x1b[0m', 'You need to return your pages in overridePages method')
      process.exit(0)
    }
  }

  // Check duplicate urls
  pages.forEach(page => {
    pages.forEach(otherPage => {
      if (page === otherPage) return

      if (page.url === otherPage.url) {
        console.warn('\x1b[31m%s\x1b[0m', 'These pages have the same url')
        console.log(page)
        console.log(otherPage)
        process.exit(0)
      }
    })
  })

  return pages
}

module.exports = {
  getUserConfig,
  getWebpackConfig,
  getPages
}
