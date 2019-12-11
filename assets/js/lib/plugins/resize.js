import EventBus from '~j/lib/helpers/event-bus'
import { debounce } from '@qneyraud/q-utils'

const debounced = debounce(() => {
  EventBus.emit('resize-debounced')
}, 300)

export default () => {
  window.addEventListener('resize', () => {
    EventBus.emit('resize')
    debounced()
  })
}
