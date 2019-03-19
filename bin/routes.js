require('@babel/register')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const deepmerge = require('deepmerge')
const { overridePages } = require('../akaru.config')

const Config = require('../config/Config')
const { overrideConfig } = require('../akaru.config')

const env = process.env.NODE_ENV

let config = new Config(env)

if (overrideConfig) {
  overrideConfig(config, { env })

  if (!config) {
    console.warn('\x1b[31m%s\x1b[0m', 'You need to return your config in overrideConfig method')
    process.exit(0)
  }
}

const pagesFolders = glob.sync('**/', {
  cwd: config.paths.pages()
})

const getDatasFromFile = (filePath, lang) => {
  let datas = {}
  if (fs.existsSync(filePath)) {
    datas = require(filePath)['default']()
  }

  datas = deepmerge(datas, datas.i18n[lang] || {})
  delete datas['i18n']
  return datas
}

const pages = []

config.langs.forEach(lang => {
  pagesFolders.forEach(pageName => {
    // Construct datas
    let datasFilePath = config.paths.pages(pageName, 'datas.js')
    let datas = getDatasFromFile(datasFilePath, lang)

    // construct URL
    let url = ''
    if (lang !== config.defaultLang) {
      url += `/${lang}`
    }
    url += `/${(datas.metas && typeof datas.metas.url === 'string') ? datas.metas.url : pageName}`

    pages.push({
      source: path.resolve(config.paths.pages(), pageName, 'index.pug'),
      lang,
      metas: datas.metas,
      url
    })
  })
})

if (overridePages) {
  overridePages(pages)
}

console.log(pages)
