import { qsa, gebc } from '@qneyraud/q-dom'
import Factory from './Factory'

export default class Element {
  constructor ({ el, type, id, root, parent, page, threshold = 0.0 }) {
    // element infos
    this.el = el
    this.id = id
    this.type = type

    // structure
    this.root = root
    this.page = page
    this.parent = parent || this.root
    this.children = []

    // datas
    this.refs = {}
    this.datas = this.el.dataset

    // usage
    this.threshold = threshold
  }

  init () {
    this.getRefs()
    this.bindMethods()
    this.initObserver()
    this.getChildren()
  }

  initObserver () {
    const callback = intersections => {
      if (intersections[0].isIntersecting) {
        this.onEnterView()
      } else {
        this.onLeaveView()
      }
    }
    const observer = new window.IntersectionObserver(callback, {
      threshold: this.threshold
    })

    observer.observe(this.el)
  }

  bindMethods () {}

  getRefs () {
    this.refs = {}
    this.refs = qsa(this.el, '[ref]')
      .filter(this.isInElementScope.bind(this))
      .reduce((el, acc) => {
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

  destroy () {}

  find (classes, all = false) {
    return gebc(this.el, classes, all)
  }

  getChildren () {
    this.children = []

    this.children = gebc(this.el, 'component', true)
      .filter(this.isInElementScope.bind(this))
      .map(componentEl => {
        const component = Factory.createComponent(componentEl, {
          root: this.root,
          parent: this,
          page: (this.type === 'page') ? this : this.page
        })
        component.init()
        return component
      })
  }

  isInElementScope (el) {
    if (this.type === 'page') return el.parentNode.closest('.component') === null
    if (this.type === 'component') return el.parentNode.closest('.component') === this.el
    return false
  }

  onEnterView () {}

  onLeaveView () {}
}
