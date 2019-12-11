class EventBus {
  constructor () {
    this.listeners = {}
  }

  on (eventName, cb) {
    if (!this.listeners[eventName]) this.listeners[eventName] = []

    this.listeners[eventName].push(cb)
  }

  off (eventName, cb = null) {
    if (!cb) {
      delete this.listeners[eventName]
      return
    }

    this.listeners[eventName] = this.listeners[eventName]
      .filter(c => c !== cb)
  }

  emit (eventName, datas) {
    if (!this.listeners[eventName] || this.listeners[eventName].length === 0) return

    this.listeners[eventName]
      .forEach(cb => {
        if (cb) cb(datas)
      })
  }
}

export default new EventBus()
