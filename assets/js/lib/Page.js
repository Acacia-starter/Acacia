// import { gebc } from '@qneyraud/q-dom'
import Element from './Element'

export default class Page extends Element {
  // constructor (datas) {
  //   super({
  //     ...datas,
  //     type: 'page'
  //   })

  // this.page = this
  // }

  init () {
    super.init()

    this.observers = []
  }

  // getObserver (threshold) {
  //   const observer = this.observers.find(o => o.threshold === threshold)

  //   if (observer) {
  //     return observer.observer
  //   } else {
  //     const observer = {
  //       threshold,
  //       observer: new window.IntersectionObserver(this.observerCallback, {
  //         threshold: threshold
  //       })
  //     }
  //     this.observers.push(observer)
  //     return observer.observer
  //   }
  // }

  // bindMethods () {
  //   super.bindMethods()
  //   this.observerCallback = this.observerCallback.bind(this)
  // }

  // observeElements () {
  //   gebc(this.el, 'observe', true)
  //     .concat(gebc(this.el, 'observe-once', true))
  //     .forEach(el => {
  //       const threshold = el.dataset.threshold || 0
  //       this.getObserver(threshold).observe(el)
  //     })
  // }

  // observerCallback (intersections) {
  //   intersections.forEach(intersection => {
  //     if (intersection.isIntersecting) {
  //       intersection.target.classList.add('in-view')

  //       if (intersection.target.classList.contains('observe-once')) {
  //         this.observers.forEach(o => o.observer.unobserve(intersection.target))
  //       }
  //     } else {
  //       intersection.target.classList.remove('in-view')
  //     }
  //   })
  // }
}
