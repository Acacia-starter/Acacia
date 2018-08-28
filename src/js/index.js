// TODO: Structure JS
import Highway from '@dogstudio/highway/dist/es5/highway'
import '../styles/index.scss'
import Home from './pages/Home.js'

/* eslint-disable-next-line no-new */
new Highway.Core({
  renderers: {
    home: Home
  },
  transitions: {
  }
})
