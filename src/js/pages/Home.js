import { Page } from 'akaru-front'

class Home extends Page {
  onEnter () {
    super.onEnter()
    console.log('enter home')
    console.log(this.blocks)
  }
  onLeave () { }
  onEnterCompleted () { }
  onLeaveCompleted () { }
}

export default Home
