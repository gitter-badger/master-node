const http = require('http')
const url = require('url')



http
  .createServer((request, response) => {

    // Get the url and parse it
    const parseUrl = url.parse(request.url, true)

    // Get the trimmed path
    const path = parseUrl.pathname
      .replace(/^\/+|\/+$/g, '') // trim slashes at the end and the begining

    // Get the query string as an object
    const queryStrObject = parseUrl.query

    // Get the HTTP method
    const method = request.method.toLowerCase()

    // Send the response
    response.end('hello world!\n')

    // Log the url request
    console.log(
      `Request ${method.toUpperCase()}: '${path}'`,
      `with query ${JSON.stringify(queryStrObject)}`
    )
  })
  .listen(3000, () => {
    console.log('The server is listening on port 3000 now')
  })