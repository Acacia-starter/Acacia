const pages = require('../config/utils').getPages()

const s = (n) => '#'.repeat(n)
const b = () => console.log('\n')

console.log(s(50))
console.log(s(21) + ' ROUTES ' + s(21))
console.log(s(50))

b()

pages.forEach(r => {
  b()
  console.log('URL', r.url)
  console.log('LANGUE', r.lang)
  console.log('METAS', r.metas)
  console.log('TEMPLATE', r.source)
  b()
  console.log(s(20))
})
