/** @jsx MyReact.createElement */
import MyReact from './MyReact.js';

const jsdom = require('jsdom');

const dom = new jsdom.JSDOM('<div id="container"></div>');
const document = dom.window.document;

const MyApp = ({
  mytext
}) => {
  return MyReact.createElement("div", {
    id: "test"
  }, MyReact.createElement("h1", null, "Hello MyReact"), MyReact.createElement("p", {
    title: "title"
  }, mytext));
};

MyReact.render(MyReact.createElement(MyApp, {
  mytext: "my react text"
}), document.querySelector("#container"), document); // <-- new line added

console.log("elementtree", JSON.stringify(MyReact.createElement(MyApp, {
  mytext: "my react text"
})));
console.log("elements", dom.serialize());
setTimeout(() => {
  console.log("elements", dom.serialize());
}, 1000);