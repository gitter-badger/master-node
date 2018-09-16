const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./lesson7.config')


http
  .createServer((request, response) => {

    // Get the url and parse it
    const parseUrl = url.parse(request.url, true)

    // Get the trimmed path
    const path = parseUrl.pathname
      .replace(/^\/+|\/+$/g, '') // trim slashes at the end and the begining

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let payloadBuffer = ''

    request
      // triggered every time we receive data from the stream
      .on('data', payloadChunk =>
        payloadBuffer += decoder.write(payloadChunk))

      // triggered only at the end of the stream
      .on('end', () => {
        payloadBuffer += decoder.end()

        const parsedRequestData = {
          path,
          queryStrObject: parseUrl.query,
          method: request.method.toLowerCase(),
          headers: request.headers,
          payload: payloadBuffer
        }

        Router.routeRequest(parsedRequestData, response)
      })
  })
  .listen(config.port, () =>
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`))

const Views = {
  log: (_, callback) => {
    // Callback a http status code and a payload object
    callback(200, {'name' : 'log handler'})
  },
  notFound: (_, callback) => {
    callback(404)
  },
}

// Router obj
const Router = {
  urls: {}
}

Router.url = (url, view) =>
  Router.urls = {
    ...Router.urls,
    [url]: view,
  }


// Define our request router
Router.routeRequest = (requestObj, response) => {

  // Choose the view this request should go into.
  // If none, go to notFound view
  const view = Router.urls[requestObj.path] || Router.urls['404']

  // Construct the data object to send to the handler

  // Route the request to the View
  view(requestObj, (statusCode, data) => {

    const _statusCode = typeof(statusCode) == 'number'
      ? statusCode
      : 200

    const _data = typeof(data) == 'object'
      ? data
      : {}

    // Return the response
    response.setHeader('Content-Type', 'application/json')
    response.writeHead(_statusCode)
    response.end(JSON.stringify(_data))

    // Log the url request
    console.log(
      `> ${requestObj.method.toUpperCase()} ${requestObj.path} ${requestObj.payload}\n`,
      `${_statusCode} ${JSON.stringify(_data)}`)
  })
}

Router.url('log', Views.log)
Router.url('404', Views.notFound)

/*
  > curl\
    --header 'Content-Type: application/json'\
    --data '{ "enjoying": "the course" }'\
    localhost:3000/log

  < Response 200 {"name":"log handler"}


  > curl\
    --header 'Content-Type: application/json'\
    --data '{ "enjoying": "the course" }'\
    localhost:3000/inexistent

  < Response 404 {}
 */