import Page from '~j/lib/Page'
import Component from '~j/lib/Component'

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

  async getComponentClass (componentId) {
    const match = this.components[componentId]

    if (!match) {
      return Component
    } else if (typeof match.then === 'function') {
      return (await match).default
    } else {
      return match
    }
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

  async getPageClass (pageId) {
    const match = this.pages[pageId]

    if (!match) {
      return Page
    } else if (typeof match.then === 'function') {
      return (await match).default
    } else {
      return match
    }
  }

  async createComponent (el, datas) {
    const componentId = el.dataset && el.dataset.component
    const ComponentClass = await this.getComponentClass(componentId)

    return new ComponentClass({
      ...datas,
      el,
      id: componentId
    })
  }

  async createPage (el, datas) {
    const pageId = el.dataset && el.dataset.page
    const PageClass = await this.getPageClass(pageId)

    return new PageClass({
      ...datas,
      el,
      id: pageId
    })
  }
}

export default new Factory()
