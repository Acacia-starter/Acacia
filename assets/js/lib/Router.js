// import { gebc } from '@qneyraud/q-utils'
// import Factory from '~j/lib/Factory'

// class Router {
//   constructor () {
//     this.currentPage = null
//     this.pages = []
//     this.useTransition = false

//     this.rootEl = document
//   }

//   setRootEl (rootEl) {
//     this.rootEl = rootEl

//     return this
//   }

//   useNavigo ({ root = null, homeId = null }) {
//     // const Navigo = require('navigo/lib/navigo')
//     this.useTransition = true

//     this.navigoRouter = new Navigo(root, true)

//     const pagesEls = gebc(this.rootEl, 'page', true)

//     pagesEls
//       .forEach(pageEl => {
//         // page class
//         const page = Factory.createPage(pageEl, {
//           root: this.rootEl
//         })
//         page.createElement()
//         page.init()

//         this.pages.push({
//           id: page.id,
//           page
//         })

//         this.bindRoute(pageEl.dataset.url, page)
//       })

//     if (homeId) {
//       const defaultPage = this.pages.find(p => p.id === homeId)

//       if (defaultPage) {
//         this.bindDefaultRoute(defaultPage.page)
//       }
//     }

//     return this
//   }

//   hideAllPages () {
//     this.pages.forEach(page => {
//       page.page.hideFast()
//     })
//   }

//   bindDefaultRoute (page) {
//     this.navigoRouter.notFound(() => {
//       if (this.currentPage) {
//         this.currentPage.traverse('beforeLeave')
//         this.currentPage.hideWrapper()
//           .then(() => {
//             this.currentPage.traverse('destroyed')
//             this.currentPage.traverse('afterLeave')
//             page.traverse('beforeEnter')
//             page.traverse('mounted')
//             return page.showWrapper()
//           })
//           .then(() => {
//             page.traverse('afterEnter')
//             this.currentPage = page
//           })
//       } else {
//         this.hideAllPages()
//         page.showFastWrapper()
//         page.traverse('beforeEnter')
//         page.traverse('mounted')
//         page.traverse('afterEnter')
//         this.currentPage = page
//       }
//     })
//   }

//   bindRoute (route, page) {
//     this.navigoRouter
//       .on(route, (params, query) => {
//         page.params = params
//         page.query = query

//         if (this.currentPage) {
//           this.currentPage.traverse('beforeLeave')
//           this.currentPage.hideWrapper()
//             .then(() => {
//               this.currentPage.traverse('destroyed')
//               this.currentPage.traverse('afterLeave')
//               page.traverse('beforeEnter')
//               page.traverse('mounted')
//               return page.showWrapper()
//             })
//             .then(() => {
//               page.traverse('afterEnter')
//               this.currentPage = page
//             })
//         } else {
//           this.hideAllPages()
//           page.showFastWrapper()
//           page.traverse('beforeEnter')
//           page.traverse('mounted')
//           page.traverse('afterEnter')
//           this.currentPage = page
//         }
//       })
//   }

//   getCurrentPage () {
//     return this.currentPage
//   }

//   start () {
//     if (this.useTransition) {
//       this.navigoRouter.resolve()
//     } else {
//       const page = Factory.createPage(gebc(this.rootEl, 'page'), {
//         root: this.rootEl
//       })
//       page.createElement()
//       page.init()
//       page.traverse('mounted')
//     }
//   }
// }

// export default new Router()
