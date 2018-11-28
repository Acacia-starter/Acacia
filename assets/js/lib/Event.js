import debug from 'debug'
import Config from './Config'

const dbg = debug(`${Config.getName()}:Lib:Event`)

export default class Event {
  constructor () {
    dbg('Initialize Events')
    this.listeners = {}
    this.bindMethods()
    this.setAvailableEvents()
  }

  bindMethods () {}

  setAvailableEvents () {
    this.availableEvents = []
  }

  getAvailableEventsByEventName (eventName) {
    return this.availableEvents.find(availableEvent => availableEvent.name === eventName)
  }

  on (eventName, cb) {
    if (!cb) {
      console.warn(`callback undefined`)
    }

    const event = this.getAvailableEventsByEventName(eventName)

    if (!event && Config.isDebugEnabled()) {
      console.warn(`event name ${eventName} not permitted`)
    }

    if (!this.listeners[eventName]) {
      event['add']()
      this.listeners[eventName] = []
    }
    this.listeners[eventName].push(cb)
  }

  off (eventName, cb = null) {
    if (this.listeners[eventName]) {
      let index = this.listeners[eventName].findIndex(c => c === cb)
      this.listeners[eventName].splice(index, 1)
    }

    if (!cb || this.listeners[eventName].length === 0) {
      this.getAvailableEventsByEventName(eventName)['remove']()
      delete this.listeners[eventName]
    }
  }

  dispatch (eventName, params = {}) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(cb => cb(params))
    }
  }
}
