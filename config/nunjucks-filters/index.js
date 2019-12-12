const path = require('path')

module.exports = {
  append: path.resolve(__dirname, './append.js'),
  merge: path.resolve(__dirname, './merge.js'),
  setAttribute: path.resolve(__dirname, './setAttribute.js')
}
