const path = require('path')

module.exports = {
  getAsset: path.resolve(__dirname, './getAsset.js'),
  getUrl: path.resolve(__dirname, './getUrl.js'),
  createComponent: path.resolve(__dirname, './createComponent.js'),
  getComponentInfos: path.resolve(__dirname, './getComponentInfos.js')
}
