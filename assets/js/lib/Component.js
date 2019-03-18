import Element from './Element'

export default class Component extends Element {
  constructor () {
    super()

    this.type = 'component'
  }
}
