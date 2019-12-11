import { qsa, gebc } from '@qneyraud/q-utils'
import Factory from '~j/lib/Factory'
import EventBus from '~j/lib/helpers/event-bus'

export default class Element {
  constructor ({ el, type, id, root, parent, page }) {
    // element infos
    this.el = el
    this.id = id
    this.uid = '_' + Math.random().toString(36).substr(2, 9)
    this.type = type

    // structure
    this.root = root
    this.page = page || this.el
    this.parent = parent || this.root
    this.children = []

    // datas
    this.refs = {}
    this.datas = this.el.dataset

    this.setElementUid()
    this.$bus = EventBus
  }

  createElement () {
    this.setRefs()
    this.setChildren()
  }

  setElementUid () {
    this.el.dataset.uid = this.uid
  }

  /**
   * Lifecycle
   */
  init () {}

  mounted () {}

  destroyed () {}

  /**
   * Transition lifecycle
  */
  beforeEnter () {}

  afterEnter () {}

  beforeLeave () {}

  afterLeave () {}

  setRefs () {
    this.refs = {}
    this.refs = qsa(this.el, '[ref]')
      .filter(this.isInElementScope.bind(this))
      .reduce((acc, el) => {
        const refValue = el.getAttribute('ref')

        if (Array.isArray(acc[refValue])) {
          acc[refValue].push(el)
        } else if (acc[refValue]) {
          acc[refValue] = [acc[refValue], el]
        } else {
          acc[refValue] = el
        }

        return acc
      }, {})
  }

  find (classes, all = false) {
    return gebc(this.el, classes, all)
  }

  setChildren () {
    this.children = []

    this.children = gebc(this.el, 'component', true)
      .filter(this.isInElementScope.bind(this))
      .map(componentEl => {
        const component = Factory.createComponent(componentEl, {
          root: this.root,
          parent: this,
          page: (this.type === 'page') ? this : this.page
        })
        component.createElement()
        component.init()
        return component
      })
  }

  getChildren () {
    return this.children
  }

  getChildrenById (id) {
    return this.children
      .filter(child => child.id === id)
  }

  getChildByUid (uid) {
    return this.children
      .filter(child => child.uid === uid)
  }

  traverse (methodName, datas = null) {
    if (this[methodName]) {
      this[methodName](datas)
    }

    this.children
      .forEach(child => {
        child.traverse(methodName, datas)
      })
  }

  isInElementScope (el) {
    if (this.type === 'page') return el.parentNode.closest('.component') === null
    if (this.type === 'component') return el.parentNode.closest('.component') === this.el
    return false
  }
}
