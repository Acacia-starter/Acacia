// contexts for all available resource queries
const contexts = {
  raw: require.context('~a?raw', true, /\.svg$/i),
  default: require.context('~a', true, /\.(jpg|png|svg)$/i)
}

module.exports = (assetUrl, resourceQuery) => {
  const ctx = contexts[resourceQuery] || contexts['default']

  return ctx(`./${assetUrl}`)
}
