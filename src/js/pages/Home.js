// Import Highway
import Highway from '@dogstudio/highway/dist/es5/highway'

class Home extends Highway.Renderer {
  onEnter () {
    console.log('object')
  }
  onLeave () { }
  onEnterCompleted () { }
  onLeaveCompleted () { }
}

// Don`t forget to export your renderer
export default Home
