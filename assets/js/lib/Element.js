export default class Element {
  constructor (root) {
    this.root = root
    this.children = []
    this.parent = null
    this.type = null
    this.els = null

    this.getChildren()
  }

  bindMethods () {}

  initElements () {}

  initEvents () {}

  removeEvents () {}

  getChildren () {}
}
