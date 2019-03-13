export default class Element {
  constructor (root) {
    this.root = root
    this.children = []
    this.parent = null
    this.type = null
    this.$refs = {}

    this.getChildren()
    this.getRefs()
  }

  bindMethods () {}

  initElements () {}

  initEvents () {}

  removeEvents () {}

  getChildren () {}

  getRefs () {
    Array.from(document.querySelectorAll('[ref]'))
      .forEach(el => {
        let refValue = el.getAttribute('ref')
        if (this.$refs[refValue]) {
          this.$refs[refValue] = [this.$refs[refValue], el]
        } else {
          this.$refs[refValue] = el
        }
      })
    console.log(this.$refs)
  }
}
