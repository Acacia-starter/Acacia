import * as contentful from 'contentful'
import article from '~c/article/use.pug'

export default {
  start: () => {
    const SPACE_ID = '7u6rdgc39n2b'
    const ACCESS_TOKEN = '132ca713885d09b68409caba27e86f3ff73d9724a3ceb2804ef469197f5c71fc'

    const client = contentful.createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN
    })
    client.getEntries({
      content_type: 'entreprise'
    })
      .then((response) => {
        response.items.forEach(item => {
          let art = article({datas: {
            title: item.fields.name
          }})
          document.body.innerHTML += art
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
