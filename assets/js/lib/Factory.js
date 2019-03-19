/* eslint-disable new-cap */
import Page from './Page'

class Factory {
  constructor () {
    this.pages = {}
    this.components = {}
  }

  matchPages (pages) {
    this.pages = pages

    return this
  }

  matchComponents (components) {
    this.components = components

    return this
  }

  getPage (pageId) {
    let page = this.pages[pageId] || Page

    if (page instanceof Promise) {
      return page
        .then(pageClass => new pageClass.default())
    } else if (page instanceof Page) {
      return Promise.resolve(page)
    } else if (page.prototype instanceof Page || page === Page) {
      return Promise.resolve(new page())
    }

    console.log('test')
  }
}

export default new Factory()
