// TODO: Structure JS
import '../styles/index.scss'
import Home from './pages/Home.js'
import AkaruFront from 'akaru-front'
import Contact from './pages/Contact'

const requireAll = (r) => {
  r.keys().forEach(r)
}

requireAll(require.context('../svg/sprite', true, /\.svg$/))

/* eslint-disable-next-line */
let akaruFront = new AkaruFront()
  .matchPages({
    home: Home,
    contact: Contact
  })
  .start()
