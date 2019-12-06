const defu = require('defu')

module.exports = nunjEnv => {
  nunjEnv.addFilter('setAttribute', (obj, key, value) => {
    obj[key] = value
    return obj
  })

  nunjEnv.addFilter('merge', (obj, obj2) => {
    return defu(obj, obj2)
  })

  nunjEnv.addFilter('append', (array, value) => {
    array.push(value)
    return array
  })
}
