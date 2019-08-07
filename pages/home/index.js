import { Page } from '~j/lib/index.js'

export default class Home extends Page {
  onEnterView () {
    super.onEnterView()
    console.log('home in view')
  }
}
