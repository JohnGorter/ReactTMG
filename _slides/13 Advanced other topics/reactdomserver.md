# ReactDOMServer


### ReactDOMServer
---
Enables you to render components to static markup

### ReactDOMServer
---
Typically, it’s used on a Node server:
```
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

---
### Overview
The following methods can be used in both the server and browser environments
- renderToString()
- renderToStaticMarkup()

These additional methods depend on a package (stream) that is only available on the server, and won’t work in the browser
- renderToNodeStream()
- renderToStaticNodeStream()

---
### renderToString()
```
ReactDOMServer.renderToString(element)
```
Render a React element to its initial HTML
- returns an HTML string
- use for faster page loads and to allow search engines to crawl your pages for SEO purposes

If you call ReactDOM.hydrate() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience

---
### renderToStaticMarkup()
```
ReactDOMServer.renderToStaticMarkup(element)
```
Similar to renderToString, but 
- doesn’t create extra DOM attributes that React uses internally, such as data-reactroot

This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes saves some bytes

> If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use renderToString on the server and ReactDOM.hydrate() on the client.

---
### renderToNodeStream()
```
ReactDOMServer.renderToNodeStream(element)
```
Render a React element to its initial HTML
- Returns readable stream that outputs an HTML string


> Note:
Server-only. This API is not available in the browser.

---
### renderToStaticNodeStream()
```
ReactDOMServer.renderToStaticNodeStream(element)
```

Similar to renderToNodeStream, but
- doesn’t create extra DOM attributes that React uses internally, such as data-reactroot

This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes saves some bytes.

> Note:
Server-only. This API is not available in the browser.



<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using ReactDomServer

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Creating your own NextJS