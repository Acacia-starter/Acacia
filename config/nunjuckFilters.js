module.exports = (nunjEnv) => {
  nunjEnv.addFilter('merge', () => {
    console.log('test')
  })
}
