import Factory from '~j/lib/Factory'
// import ticker from '@lib/plugins/ticker'

/**
 * Polyfill
 */
// https://caniuse.com/#search=intersectionobserver
import 'intersection-observer'

// Element.closest used in lib https://caniuse.com/#search=element.closest
// import '@lib/polyfills/closest'

/**
 * Pages
 */
import Home from '~p/home/index.js'

/**
 * Components
 */
import Image from '~c/blocks/image/index.js'

/**
 * Styles
 */
require('~s/index.styl')

Factory
  .matchPages({
    home: Home
  })
  .matchComponents({
    image: Image
  })

// Router
//   .setRootEl(rootElement)
//   .useNavigo({
//     homeId: 'home'
//   })
//   .start()

// plugins
// resize()
// ticker()
