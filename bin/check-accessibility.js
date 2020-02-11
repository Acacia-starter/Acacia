/* eslint-disable no-console */
const getProjectConfig = require('../config/ProjectConfig')
const handler = require('serve-handler')
const http = require('http')
const fs = require('fs')
const fsPromises = fs.promises
const lumberjack = require('@jakepartusch/lumberjack')
const { printResults } = require('@jakepartusch/lumberjack/src/output')

const PORT = 3000

const isGenerated = async () => {
  const projectConfig = getProjectConfig()

  try {
    await fsPromises.lstat(projectConfig.paths.dist())

    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('\x1b[31mYou should generate the site before running this script\x1b[0m')
    } else {
      console.log(err)
    }

    return false
  }
}

const run = async () => {
  const generated = await isGenerated()
  if (!generated) process.exit(0)

  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: 'generate'
    })
  })

  server.listen(PORT, async () => {
    const results = await lumberjack(`http://localhost:${PORT}`, {})
    printResults(results)

    server.close()
  })
}

run()
