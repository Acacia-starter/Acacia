import Event from '../Event'

export const RESIZE = 'RESIZE'

export const ORIENTATION_CHANGE = 'ORIENTATION_CHANGE'

export const FULLSCREEN_CHANGE = 'FULLSCREEN_CHANGE'

class Screen extends Event {
  constructor () {
    super()

    this.orientation = {}
    this.size = {}
    this.fullscreen = false

    this.breakpoints = [{
      name: 'base',
      width: 0
    }, {
      name: 'mobile',
      width: 576
    }, {
      name: 'tablet',
      width: 768
    }, {
      name: 'desktop',
      width: 992
    }, {
      name: 'large',
      width: 1200
    }, {
      name: 'xlarge',
      width: 1440
    }]

    this.setSize()
  }

  bindMethods () {
    this.addResizeEvent = this.addResizeEvent.bind(this)
    this.removeResizeEvent = this.removeResizeEvent.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  setAvailableEvents () {
    this.availableEvents = [{
      name: RESIZE,
      add: this.addResizeEvent,
      remove: this.removeResizeEvent
    }]
  }

  addResizeEvent () {
    window.addEventListener('resize', this.onResize)
    console.log('add resize event')
  }

  onResize () {
    this.setSize()
    this.dispatch(RESIZE, {
      ...this.size
    })
  }

  removeResizeEvent () {
    window.removeEventListener('resize', this.onResize)
  }

  addFullscreenEvent () {
    window.addEventListener('fullscreenchange', () => {
      this.setFullscreen()
      this.dispatch(ORIENTATION_CHANGE, {
        fullscreen: this.fullscreen
      })
    })
  }

  addOrientationEvent () {
    window.addEventListener('orientationchange', (e) => {
      this.setOrientation()
      this.dispatch(ORIENTATION_CHANGE, {
        ...this.orientation
      })
    })
  }

  setOrientation () {
    this.orientation = {
      value: window.screen.orientation.angle,
      type: (Math.abs(window.screen.orientation.angle) === 0 || Math.abs(window.screen.orientation.angle) === 180) ? 'portrait' : 'landscape'
    }
  }

  setSize () {
    let breakpoint = this.breakpoints.find(bp => bp.width < window.innerWidth)

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
      breakpoint
    }
  }

  setFullscreen () {
    this.fullscreen = document.fullscreen
  }
}

export default new Screen()
