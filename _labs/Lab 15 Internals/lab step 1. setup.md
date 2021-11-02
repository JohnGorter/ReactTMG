# Create react stack

### Step 1. Create a new nodejs package project

Make a new folder named myreact. go into this folder and execute

```
npm init --yes
```

Add the following dependencies
```
npm i @babel/core @babel/preset-env @babel/preset-react @babel/cli jsdom --save-dev
```

Babel is used for transpilation, jsnode is to fake a dom implementation

Create a subfolder 'src'.

This is the place were we hold our source code.

Create a file called index.js and add the following code:
```
console.log("hello world");
```

now from the myreact folder execute the babel transpiler like this:
```
./node_modules/.bin/babel src --out-dir public   
```

If all went well, there should be a public folder with the index.js file with the following content:
```
console.log("hello world");
```

Your setup is working!

### Step 2. Test jsx transpilation

Now in your index.js, add the following code:
```
let test = <h1>hello world </h1>
console.log("test", test); 
```

notice that we use JSX here.. 
compile this as before, what is the result? 

```
Support for the experimental syntax 'jsx' isn't currently enabled (1:12):

> 1 | let test = <h1>hello world </h1>
    |            ^
  2 | console.log("test", test); 
```

Lets enable this by using a babel configuration.
Add the following file to the root of your project:

babel.config.json
```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Try to comile again, now it should work and successfully created the output of our code. This shows:
```
"use strict";

var test = /*#__PURE__*/React.createElement("h1", null, "hello world ");
console.log("test", test);
```

But we want to generate our own createElement calls here..

Add the following comment in your index.js file in the src folder at the top of the file:
```
/** @jsx MyReact.createElement */
```

Retranspile again and notice the call to our very own createElement:
```
"use strict";

/** @jsx MyReact.createElement */
var test = MyReact.createElement("h1", null, "hello world ");
console.log("test", test);
```

### Step 3.Introduction to the JSDom
JSDom is a serverside pure JavaScript implementation of the DOM
We can use this to fake a document to render our application in..

In your src folder, in the index.js, replace the entire contents to the following code:
```
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<div id="container"></div>');
const document = dom.window.document;

console.log("Serialized dom =>", dom.serialize());
```
Now we want to execute the transiled code, to do this, change the following to the package json in the scripts section:
```
 "scripts": {
    "start": "node ./public/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Now we can test our code by using 
```
./node_modules/.bin/babel src --out-dir public
```
and then 
```
npm start
```

Try it, this shoud output the following:
```
Serialized dom => <html><head></head><body><div id="container"></div></body></html>
```

Wauw, we have a working fake browser and a JSX (JavaScript XML) transpiler!

Step 
Lets add some react like code in our index.js. Open the index.js file and add the following code
```
/** @jsx MyReact.createElement */
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<div id="container"></div>');
const document = dom.window.document;
const element = <h1>Hello MyReact</h1>

console.log("elements", dom.serialize());
```

Transpile this code
```
./node_modules/.bin/babel src --out-dir public
```

Run this code
```
npm start
```

Check the error:
```
var element = MyReact.createElement("h1", null, "Hello MyReact");
              ^

ReferenceError: MyReact is not defined
```

For the sake of completeness, change the line of code that constructs the element in index.js as follows:
```
/** @jsx MyReact.createElement */
const element = <div><h1>Hello MyReact</h1><p>My first MyReact</p></div>
```
Check the generated javascript, it should be something like this:
```
var element = MyReact.createElement("div", null, MyReact.createElement("h1", null, "Hello MyReact"), MyReact.createElement("p", null, "My first MyReact"));
```

Notice that the createElements of the children are added as positional arguments!

Lets built our version of react now!!


### Step 4. Building react

We have to implement MyReact.createElement, as the error shows, lets do that!

Create a new file inside the src folder and name this MyReact.js.
Add the following code:
```
const MyReact = {
    createElement
}

function createElement(elementType, properties, ...content) {
    return {
        type:elementType, 
        props:{
            ...properties, 
            children:content
        }
    }
}

export default MyReact
```

This should create a tree of elements holding the type, properties for each of them.
Inspect this by adding the following code to the index.js

Add the follling to the top of the file
```
import MyReact from './MyReact.js'

```

Add the following to the line  just before the last console.log:
```
console.log("elementtree", JSON.stringify(element));
```

Transpile and run the code. 
The output, if done successfully is like below:
```
elementtree {"type":"div","props":null,"children":[{"type":"h1","props":null,"children":["Hello MyReact"]},{"type":"p","props":null,"children":["My first MyReact"]}]}
elements <html><head></head><body><div id="container"></div></body></html>
```

Notice how the elementtree is getting shape, but wait, what is the ['Hello MyReact"] child?


This is just a string!

Lets add the code so that these textnodes are transformed to text elements:

inside our MyReact.js code. Change the following to our createElement function
```
...
    props:{
        ...properties, 
        children: content.map(child =>
            typeof child === "object"
                ? child
                : createTextElement(child)
            ),
    }
...
```

Notice the special createTextElement, lets implement this function.
Add the following code to the MyReact.js file. This should return "TEXT_ELEMENT" nodes in our tree.

```
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
        nodeValue: text,
        children: [],
        },
    }
}
```

The nodeValue property holds the regular text and the rest is empty, like a leaf object.

Run the code again, your element tree now should look like this:
```
elementtree {"type":"div","props":{"children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"My first MyReact","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"></div></body></html>
```

copy and paste this output in https://jsonformatter.org/json-pretty-print and inspect the tree..
```
{"type":"div","props":{"children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"My first MyReact","children":[]}}]}}]}}
```

We now are half way there. But we still need to make the DOM nodes... thats were the render function is for.

### Step 5. Rendering

Now we have a tree, lets make the DOM nodes given the tree.

Add the render function to the MyReact code. Open the MyReact.js file in the src folder and add the following code just above the export expression:
```
function render(element, container, document) {
    // create the dom node given the type, special case for just text, then create a text node
    const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
    // assign properties to the node just created...
    Object.keys(element.props).filter(key => key !== "children").forEach(name => { dom[name] = element.props[name] })
    // walk the tree and process each child... give dom as the node to render in... (recursively)
    element.props.children.forEach(child => render(child, dom, document))
    // add the result to the root element... 
    container.appendChild(dom)
}
```

Add this function to the MyReact constant:
```
const MyReact = {
    createElement,
    render
}
```

Last step, add the call to render to the index.js in the src fodler of your project:
```
const element = <div><h1>Hello MyReact</h1><p>My first MyReact</p></div>

MyReact.render(element, document.querySelector("#container"), document)  // <-- new line added
console.log("elementtree", JSON.stringify(element));
console.log("elements", dom.serialize());
```

Transpile and run the code. The output should be someting like this (actually exactly like this):
```
elementtree {"type":"div","props":{"children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"My first MyReact","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"><div><h1>Hello MyReact</h1><p>My first MyReact</p></div></div></body></html>
```

Notice inside the container that the element tree is propagated to the jsdom document.. 

Wauw!! Our own react code is working..

### Step 6. Properties

Lets add some properties to our html.

Change the element to something like this:
```
const element = <div id="test"><h1>Hello MyReact</h1><p title="title">My first MyReact</p></div>
```

If you execute this, the output shows the following:
```
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">My first MyReact</p></div></div></body></html>
```

### Step 7. Functional components
While we are at it, lets add functional components to the mix.

First, change the index.js in the src folder so we act as if we already have functional components:
```
/** @jsx MyReact.createElement */

import MyReact from './MyReact.js'

const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<div id="container"></div>');
const document = dom.window.document;

// changed content 
const MyApp = () => {
    return <div id="test"><h1>Hello MyReact</h1><p title="title">My first MyReact</p></div>
}

MyReact.render(<MyApp />, document.querySelector("#container"), document)  
console.log("elementtree", JSON.stringify(<MyApp/>));
console.log("elements", dom.serialize());
// end changed content 
```


If you execute this after transpilation, we get the following error:
```
/Users/johngorter/Desktop/myreact/myreact/node_modules/jsdom/lib/jsdom/living/helpers/validate-names.js:10
    throw DOMException.create(globalObject, [`"${name}" did not match the Name production`, "InvalidCharacterError"]);
    ^
[DOMException [InvalidCharacterError]: "function MyApp() {
  return _MyReact["default"].createElement("div", {
    id: "test"
  }, _MyReact["default"].createElement("h1", null, "Hello MyReact"), _MyReact["default"].createElement("p", {
    title: "title"
  }, "My first MyReact"));
}" did not match the Name production]
```

The error comes from jsdom saying we cannot create an element that is not a known element.

Comment out the render call for a moment and then run the code again. Change the index.js with this line:

```
// MyReact.render(<MyApp />, document.querySelector("#container"), document)  // <-- change
```

The output is:
```
elementtree {"props":{"children":[]}}
elements <html><head></head><body><div id="container"></div></body></html>
```

Our element tree is gone! 

Our first argument of the createElement call does not take an object nor plain text, it now is a function.

We have to change our createElement to create the tree after executing the function.

Open the MyReact.js code and change the createElement function like below:
```
function createElement(elementType, properties, ...content) {
    if (elementType instanceof Function) return elementType();
    return {
        type:elementType, 
        props:{
            ...properties, 
            children: content.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
                ),
        }
    }
}
```

Test the code after transpilation, check to see if the tree is back...
The output should be someting like this:
```
elementtree {"type":"div","props":{"id":"test","children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"title":"title","children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"My first MyReact","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"></div></body></html>
```

Notice the dom is not updated because we commented out the render function..
Now uncomment the render call and check the result again after transpilation and execution:
```
elementtree {"type":"div","props":{"id":"test","children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"title":"title","children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"My first MyReact","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">My first MyReact</p></div></div></body></html>
```

It works, or doesnt it??

Change the code in index.js to reflect the folling:
```
...
const MyApp = ({mytext}) => {
    return <div id="test"><h1>Hello MyReact</h1><p title="title">{mytext}</p></div>
}
MyReact.render(<MyApp mytext="my react text"/>, document.querySelector("#container"), document) 
console.log("elementtree", JSON.stringify(<MyApp mytext="my react text" />));
...
```

Notice that we use property destructuring to get the mytext prop and reflect this content in the p tag in our content.

Run this code after transpilation, this code should generate the following error:
```
> myreact@1.0.0 start /Users/johngorter/Desktop/myreact/myreact
> node ./public/index.js

/Users/johngorter/Desktop/myreact/myreact/public/index.js:14
  var mytext = _ref.mytext;
                    ^

TypeError: Cannot read property 'mytext' of undefined
    at MyApp (/Users/johngorter/Desktop/myreact/myreact/public/index.js:14:21)
    at Object.createElement (/Users/johngorter/Desktop/myreact/myreact/public/MyReact.js:22:47)
    at Object.<anonymous> (/Users/johngorter/Desktop/myreact/myreact/public/index.js:22:48)
```

There is no mytext property on the _ref parameter. 

This makes sense, we call the function without parameters at all.

Lets change this. 

Open MyReact.js and change the following line:

```
if (elementType instanceof Function) return elementType(properties);  // <-- change
```

Now re-transpile and run the code. This should work and our React clone is already pretty complete..

The code after executing, should be someting like:
```
elementtree {"type":"div","props":{"id":"test","children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"title":"title","children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"my react text","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">my react text</p></div></div></body></html>
```

Our custom property is reflected in the p tag, as expexted!

Congratulations, you have made it this far.

