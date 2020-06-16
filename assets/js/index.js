import { qs } from '@qneyraud/q-utils'
import Factory from '~j/lib/Factory'

/**
 * Pages
 */
// import Home from '~p/home/index.js'

/**
 * Components
 */
import Image from '~c/blocks/image/index.js'

/**
 * Plugins
 */
// import ticker from '@lib/plugins/ticker'

/**
 * Styles
 */
require('~s/index.styl')

Factory
  .matchPages({
    home: import('~p/home/index.js')
  })
  .matchComponents({
    image: Image
  })

const start = async () => {
  const page = await Factory.createPage(qs(document.body, '.page'), {
    root: document.body
  })
  page.createElement()
  page.init()
  page.traverse('mounted')
}

if (window.polyfilled) {
  start()
} else {
  window.onPolyfill = start
}
