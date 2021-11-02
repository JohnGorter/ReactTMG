/** @jsx MyReact.createElement */

import MyReact from './MyReact.js'

const jsdom = require('jsdom');
const dom = new jsdom.JSDOM('<div id="container"></div>');
const document = dom.window.document;

const MyApp = ({mytext}) => {
    return <div id="test"><h1>Hello MyReact</h1><p title="title">{mytext}</p></div>
}
MyReact.render(<MyApp mytext="my react text"/>, document.querySelector("#container"), document)  // <-- new line added
console.log("elementtree", JSON.stringify(<MyApp mytext="my react text" />));
console.log("elements", dom.serialize());

setTimeout(() => {
    console.log("elements", dom.serialize());
}, 1000);