import '../styles/index.scss'

// requireAll(require.context('../svg/sprite', true, /\.svg$/))

// const requireAll = (r) => {
//   r.keys().forEach(r)
// }

import('~p/home/index.js')
  .then(page => {
    page.default.start()
  })
