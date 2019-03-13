import Element from './Element'

export default class Page extends Element {
  constructor () {
    super()
    this.type = 'page'
  }

  onEnter () {
    console.log('enter')
  }
}
