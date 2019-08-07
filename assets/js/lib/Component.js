import Element from './Element'

export default class Component extends Element {
  constructor (datas) {
    super({
      ...datas,
      type: 'component'
    })
  }

  beforeDestroy () {}
}
