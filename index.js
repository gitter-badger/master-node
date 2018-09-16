const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder


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

    // Get the headers as an object
    const headers = request.headers

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let payloadBuffer = ''

    request
      .on('data', payloadChunk =>
        payloadBuffer += decoder.write(payloadChunk))
      .on('end', () => {
        payloadBuffer += decoder.end()

        // Send the response once the request payload are received
        // completely
        response.end('hello world!\n')

        // Log the url request
        console.log(
          `Request ${method.toUpperCase()}: '${path}'`,
          `with query ${JSON.stringify(queryStrObject)}`,
          `with headers ${JSON.stringify(headers)}`,
          `with payload ${payloadBuffer}`,
        )
      })
  })
  .listen(3000, () => {
    console.log('The server is listening on port 3000 now')
  })

/*
  > curl\
    --header 'foo: bar'\
    --header 'hola: que tal'
    localhost:3000/auth?logged=false

  < Request GET: 'auth' with query {"logged":"false"} with headers {"host":"localhost:3000","user-agent":"curl/7.54.0","accept":"*\/*","foo":"bar","hola":"que tal"} with payload


  > curl\
    --header 'Content-Type: application/json'\
    --data '{ "enjoying": "the course" }'\
    localhost:3000/log

  < Request POST: 'log' with query {} with headers {"host":"localhost:3000","user-agent":"curl/7.54.0","accept":"*\/*","content-type":"application/json","content-length":"28"} with payload { "enjoying": "the course" }


  > curl\
    --data 'lorem ipsum dolor sit amet'\
    localhost:3000/log

  < Request POST: 'log' with query {} with headers {"host":"localhost:3000","user-agent":"curl/7.54.0","accept":"*\/*","content-length":"26","content-type":"application/x-www-form-urlencoded"} with payload lorem ipsum dolor sit amet
 */