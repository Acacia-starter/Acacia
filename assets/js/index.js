// import '../styles/index.scss'

const requireAll = (r) => {
  r.keys().forEach(r)
}

requireAll(require.context('../../pages', true, /\\index.js$/))

// requireAll(require.context('../svg/sprite', true, /\.svg$/))
