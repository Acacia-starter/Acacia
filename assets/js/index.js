import '../styles/index.styl'
import Factory from './lib/Factory'

// requireAll(require.context('../svg/sprite', true, /\.svg$/))
// const requireAll = (r) => {
//   r.keys().forEach(r)
// }

const pages = {
  home: import('~p/home/index.js')
}

Factory.matchPages(pages)

const pageId = document.body.dataset.pageId
Factory.getPage(pageId)
  .then(page => page.onEnter())
