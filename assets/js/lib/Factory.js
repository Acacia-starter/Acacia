import { Page, Component } from './index'

class Factory {
  constructor () {
    this.pages = {}
    this.components = {}
  }

  matchComponent (key, classRef) {
    this.components[key] = classRef

    return this
  }

  matchComponents (components) {
    this.components = {
      ...this.components,
      ...components
    }

    return this
  }

  matchPage (key, classRef) {
    this.pages[key] = classRef

    return this
  }

  matchPages (pages) {
    this.pages = {
      ...this.pages,
      ...pages
    }

    return this
  }

  createComponent (el, datas) {
    const componentId = el.dataset && el.dataset.component
    let componentInstance

    if (!this.components[componentId]) {
      componentInstance = new Component({
        ...datas,
        el,
        id: componentId
      })
    } else {
      componentInstance = new this.components[componentId]({
        ...datas,
        el,
        id: componentId
      })
    }

    return componentInstance
  }

  createPage (el, datas) {
    const pageId = el.dataset && el.dataset.page
    let pageInstance

    if (!this.pages[pageId]) {
      pageInstance = new Page({
        ...datas,
        el,
        id: pageId
      })
    } else {
      pageInstance = new this.pages[pageId]({
        ...datas,
        el,
        id: pageId
      })
    }

    return pageInstance
  }
}

export default new Factory()
