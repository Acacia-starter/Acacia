/* eslint-disable */
module.exports = (from, to) => {
  const ret = []
  const fromParts = from.split('/').filter(a => a.length)
  const toParts = to.split('/').filter(a => a.length)

  for (let i = 0; i < Math.max(fromParts.length, toParts.length); i++) {
    if (fromParts[i] === toParts[i]) continue

    if (!fromParts[i]) {
      ret.push(toParts[i])
    } else {
      ret.push('..')
    }
  }

  return ret.join('/')
}
