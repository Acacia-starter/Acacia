const getConfig = require('../config/Config')

const s = (n) => '#'.repeat(n)
const b = () => console.log('\n')

console.log(s(50))
console.log(s(21) + ' ROUTES ' + s(21))
console.log(s(50))

b()

getConfig().pages.forEach(r => {
  b()
  console.log('URL', r.url)
  console.log('LANGUE', r.lang)
  console.log('TEMPLATE', r.source)
  b()
  console.log(s(20))
})
