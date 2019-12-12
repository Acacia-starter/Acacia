const ctx = require.context('~a', true, /\.(jpg|png|svg)$/i)

module.exports = assetUrl => ctx(`./${assetUrl}`)
