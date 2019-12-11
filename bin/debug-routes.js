const path = require('path')
const getConfig = require('../config/Config')

const config = getConfig()

// Process
const pages = config.pages.map(page => {
  const cleanedUp = {}

  cleanedUp['Url'] = page.url
  cleanedUp['Lang'] = page.lang
  cleanedUp['Source template'] = path.relative(config.paths.base(), page.source)
  cleanedUp['Destination file'] = path.relative(config.paths.base(), page.destination)

  return cleanedUp
})

console.table(pages)
