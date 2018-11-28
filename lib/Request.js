export default class Request {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.abortController = new window.AbortController()

    // Request parameters, set to default values
    this.method = 'GET'
    this.cache = 'default'
    this.referrer = 'client'
    this.redirect = 'follow'
    this.mode = 'cors'
    this.integrity = ''
    this.credentials = 'omit'
    this.headers = {}
    this.bodyParams = null
    this.getParams = null
  }

  setCache (cache) {
    this.cache = cache
  }

  setCredentials (credentials) {
    this.credentials = credentials
  }

  setMode (mode) {
    this.mode = mode
  }

  setRedirect (redirect) {
    this.redirect = redirect
  }

  setReferrer (referrer) {
    this.referrer = referrer
  }

  setMethod (method) {
    this.method = method
  }

  setHeaders (headers) {
    this.headers = {
      ...this.headers,
      ...headers
    }
  }

  setGetParams (getParams) {
    this.getParams = getParams
  }

  addGetParam (key, value) {
    if (!this.getParams) this.getParams = {}
    this.getParams[key] = value
  }

  setBodyParams (bodyParams) {
    this.bodyParams = bodyParams
  }

  addBodyParam (key, value) {
    if (!this.bodyParams) this.bodyParams = {}
    this.bodyParams[key] = value
  }

  setHeader (key, value) {
    this.header[key] = value
  }

  fetch () {
    let url = this.baseUrl
    let requestParameters = {
      method: this.method,
      headers: new window.Headers(this.headers),
      mode: this.mode,
      credentials: this.credentials,
      cache: this.cache,
      redirect: this.redirect,
      referrer: this.referrer,
      integrity: this.integrity,
      signal: this.abortController
    }

    if (this.body) {
      requestParameters.body = this.body
    }

    if (this.getParams) {
      let getString = Object.keys(this.getParams).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(this.getParams[key])
      }).join('&')

      url += `?${getString}`
    }

    return window.fetch(url, requestParameters)
  }

  abort () {
    this.abortController.abort()
  }
}
