import { gebc } from '@qneyraud/q-utils'

const observers = []

const observerCallback = (intersections) => {
  intersections.forEach(intersection => {
    if (intersection.isIntersecting) {
      intersection.target.classList.add('in-view')

      if (intersection.target.classList.contains('observe-once')) {
        observers.forEach(o => o.observer.unobserve(intersection.target))
      }
    } else {
      intersection.target.classList.remove('in-view')
    }
  })
}

const getObserver = (threshold, marginTop) => {
  const observer = observers.find(o => o.threshold === threshold && o.marginTop === marginTop)

  if (observer) {
    return observer.observer
  } else {
    const observer = {
      threshold,
      marginTop,
      observer: new window.IntersectionObserver(observerCallback, {
        threshold: threshold,
        rootMargin: `0px 0px ${-marginTop}px 0px`
      })
    }
    observers.push(observer)
    return observer.observer
  }
}

export default (parent) => {
  gebc(parent, 'observe', true)
    .concat(gebc(parent, 'observe-once', true))
    .forEach(el => {
      const threshold = parseFloat(el.dataset.threshold) || 0
      const marginTop = parseInt(el.dataset.margin) || 0
      getObserver(threshold, marginTop).observe(el)
    })
}
