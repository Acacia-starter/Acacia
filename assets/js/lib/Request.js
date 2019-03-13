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
    return this
  }

  setCredentials (credentials) {
    this.credentials = credentials
    return this
  }

  setMode (mode) {
    this.mode = mode
    return this
  }

  setRedirect (redirect) {
    this.redirect = redirect
    return this
  }

  setReferrer (referrer) {
    this.referrer = referrer
    return this
  }

  setMethod (method) {
    this.method = method
    return this
  }

  setHeaders (headers) {
    this.headers = {
      ...this.headers,
      ...headers
    }
    return this
  }

  setGetParams (getParams) {
    this.getParams = getParams
    return this
  }

  addGetParam (key, value) {
    if (!this.getParams) this.getParams = {}
    this.getParams[key] = value
    return this
  }

  setBodyParams (bodyParams) {
    this.bodyParams = bodyParams
    return this
  }

  addBodyParam (key, value) {
    if (!this.bodyParams) this.bodyParams = {}
    this.bodyParams[key] = value
    return this
  }

  setHeader (key, value) {
    this.header[key] = value
    return this
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
