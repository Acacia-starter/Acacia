import Element from '~j/lib/Element'

export default class Component extends Element {
  constructor (datas) {
    super({
      ...datas,
      type: 'component'
    })
  }
}
