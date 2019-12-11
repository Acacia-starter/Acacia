import Element from '~j/lib/Element'
import { removeClass, addClass, gebc } from '@qneyraud/q-utils/umd/q-utils.js'
import observe from '~j/lib/helpers/observer'

export default class Page extends Element {
  constructor (datas) {
    super({
      ...datas,
      type: 'page'
    })
  }

  beforeEnter () {
    super.beforeEnter()
    removeClass(this.root, 'loading')
    window.scrollTo(0, 0)
  }

  afterEnter () {
    super.afterEnter()
    observe(this.page)
  }

  beforeLeave () {
    super.beforeLeave()
    addClass(this.root, 'loading')
  }

  afterLeave () {
    super.afterLeave()
    removeClass(gebc(this.page, 'in-view', true), 'in-view')
  }

  hide (done) {
    const transitionDuration = 0.5

    this.el.style.transitionDuration = `${transitionDuration}s`
    this.el.style.opacity = 0

    window.setTimeout(() => {
      this.el.style.display = 'none'
      done()
    }, transitionDuration * 1000)
  }

  show (done) {
    const transitionDuration = 0.5

    this.el.style.display = 'block'
    window.setTimeout(() => {
      this.el.style.transitionDuration = `${transitionDuration}s`
      this.el.style.opacity = 1
    }, 100)

    window.setTimeout(() => {
      done()
    }, transitionDuration * 1000)
  }

  showFast (done) {
    this.el.style.display = 'block'
    this.el.style.opacity = 0.95
    done()
  }

  hideFast () {
    this.el.style.display = 'none'
    this.el.style.opacity = 0
  }

  showWrapper () {
    return new Promise((resolve) => {
      this.show(resolve)
    })
  }

  showFastWrapper () {
    return new Promise((resolve) => {
      this.showFast(resolve)
    })
  }

  hideWrapper () {
    return new Promise((resolve) => {
      this.hide(resolve)
    })
  }
}
