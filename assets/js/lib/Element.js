import { qsa, gebc } from '@qneyraud/q-utils'
import App from '~j/lib/index'

export default class Element {
  constructor ({ el, type, id, root, parent, page }) {
    // element infos
    this.el = el
    this.id = id
    this.uid = this.el.dataset.uid
    this.type = type

    // structure
    this.root = root
    this.page = page || this.el
    this.parent = parent || this.root
    this.children = []

    // datas
    this.refs = {}
    this.datas = this.el.dataset
  }

  async createElement () {
    this.setRefs()
    this.injectPlugins()
    await this.setChildren()
  }

  injectPlugins () {
    const inject = (name, value) => {
      this[`$${name}`] = value
    }

    App.plugins
      .forEach(plugin => plugin({ inject }))
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

  async setChildren () {
    this.children = []

    const promises = qsa(this.el, App.Config.get('componentSelector'))
      .filter(this.isInElementScope.bind(this))
      .map(async componentEl => {
        const component = await App.Factory.createComponent(componentEl, {
          root: this.root,
          parent: this,
          page: (this.type === 'page') ? this : this.page
        })
        component.createElement()
        component.init()
        return component
      })

    this.children = await Promise.all(promises)
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
