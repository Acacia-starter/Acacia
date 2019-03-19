const webpack = require('webpack')
const config = require('../config/index.babel')

const compiler = webpack(config)
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(stats.toString(config.stats))
})
