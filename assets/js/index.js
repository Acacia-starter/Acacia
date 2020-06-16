import App from '~j/lib/index'

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
import EventBus from '~j/plugins/event-bus'

/**
 * Styles
 */
require('~s/index.styl')

const start = async () => {
  App.init({
    pages: {
      home: import('~p/home/index.js')
    },
    components: {
      image: Image
    },
    plugins: [
      EventBus
    ]
  })

  App.start()
}

if (window.polyfilled) {
  start()
} else {
  window.onPolyfill = start
}
