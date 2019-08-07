import Factory from './lib/Factory'
import { gebi, gebc } from '@qneyraud/q-dom'

// pages
import Home from '../../pages/home/index.js'

// components

// style
require('~s/index.styl')

Factory
  .matchPages({
    home: Home
  })
  .matchComponents({})

window.onload = () => {
  const root = gebi('root')

  if (root) {
    const page = gebc(root, 'page')

    if (page) {
      Factory.createPage(gebc(root, 'page'), {
        root
      }).init()
    }
  }
}

// debug overflow x
// var docWidth = document.documentElement.offsetWidth;

// [].forEach.call(
//   document.querySelectorAll('*'),
//   function (el) {
//     if (el.offsetWidth > docWidth) {
//       console.log(el, el.offsetWidth)
//     }
//   }
// )
