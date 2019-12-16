/* eslint-disable no-console */
const path = require('path')
const getProjectConfig = require('../config/ProjectConfig')

const projectConfig = getProjectConfig()

// Process
const pages = projectConfig.pages.map(page => {
  const cleanedUp = {}

  cleanedUp['Url'] = page.url
  cleanedUp['Locale'] = page.locale
  cleanedUp['Source template'] = path.relative(projectConfig.paths.base(), page.source)
  cleanedUp['Destination file'] = path.relative(projectConfig.paths.base(), page.destination)

  return cleanedUp
})

console.table(pages)
