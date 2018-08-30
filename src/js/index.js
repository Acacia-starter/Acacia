// TODO: Structure JS
import Highway from '@dogstudio/highway/dist/es5/highway'
import '../styles/index.scss'
import Home from './pages/Home.js'

const requireAll = (r) => {
  r.keys().forEach(r)
}

requireAll(require.context('../svg/sprite', true, /\.svg$/))

/* eslint-disable-next-line no-new */
new Highway.Core({
  renderers: {
    home: Home
  },
  transitions: {
  }
})
