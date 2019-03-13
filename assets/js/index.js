import '../styles/index.styl'

// requireAll(require.context('../svg/sprite', true, /\.svg$/))
// const requireAll = (r) => {
//   r.keys().forEach(r)
// }

// const pages = {
//   home: import('~p/home/index.js')
// }

import('~p/home/index.js')
  .then(pageFile => {
    /* eslint-disable new-cap */
    let page = new pageFile.default()
    page.onEnter()
  })
