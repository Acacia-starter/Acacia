import Event from '../Event'

export const SCROLL = 'SCROLL'

class Screen extends Event {
  constructor () {
    super()

    this.scroll = {
      x: 0,
      y: 0
    }

    this.setScroll()
  }

  bindMethods () {
    this.addScrollEvent = this.addScrollEvent.bind(this)
    this.removeScrollEvent = this.removeScrollEvent.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  setAvailableEvents () {
    this.availableEvents = [{
      name: SCROLL,
      add: this.addScrollEvent,
      remove: this.removeScrollEvent
    }]
  }

  addScrollEvent () {
    window.addEventListener('scroll', this.onScroll)
  }

  onScroll () {
    this.setScroll()
    this.dispatch(SCROLL, {
      ...this.scroll
    })
  }

  removeScrollEvent () {
    window.removeEventListener('scroll', this.onScroll)
  }

  setScroll () {
    this.scroll = {
      x: window.scrollX,
      y: window.scrollY
    }
  }
}

export default new Screen()
