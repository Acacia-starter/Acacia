class RafManager {
  constructor () {
    this.registered = {}
    this.isRunning = false
  }

  register (label, method) {
    this.registered[label] = method

    if (!this.isRunning) {
      this.isRunning = true
      this.loop()
    }
  }

  unregister (label) {
    delete this.registered[label]
  }

  loop () {
    for (const method in this.registered) {
      this.registered[method]()
    }

    window.requestAnimationFrame(this.loop.bind(this))
  }
}

export default new RafManager()
