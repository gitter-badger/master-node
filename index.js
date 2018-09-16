const http = require('http')
const url = require('url')



http
  .createServer((request, response) => {

    // 1. Get the url and parse it
    const parseUrl = url.parse(request.url, true)

    // 2. Get the trimmed path
    const path = parseUrl.pathname
      .replace(/^\/+|\/+$/g, '') // trim slashes at the end and the begining

    // 3. Get the HTTP method
    const method = request.method.toLowerCase()

    // 4. Send the response
    response.end('hello world!\n')

    // 5. Log the url request
    console.log(`Request ${method.toUpperCase()}: '${path}'`)
  })
  .listen(3000, () => {
    console.log('The server is listening on port 3000 now')
  })