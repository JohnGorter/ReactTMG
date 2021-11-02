/** @jsx MyReact.createElement */
import MyReact from './MyReact.js';

const MyApp = () => {
  const [state, setState] = MyReact.useState(1);
  return MyReact.createElement("div", {
    onClick: () => setState(c => c + 1)
  }, " Count: ", state, " ");
};

MyReact.render(MyReact.createElement(MyApp, null), document.querySelector("#container"), document);