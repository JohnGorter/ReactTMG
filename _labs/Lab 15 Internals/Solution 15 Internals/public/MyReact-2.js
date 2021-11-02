const requestIdleCallback = require('ric-shim');

const MyReact = {
  createElement,
  render
};

function createElement(elementType, properties, ...content) {
  if (elementType instanceof Function) return elementType(properties);
  return {
    type: elementType,
    props: { ...properties,
      children: content.map(child => typeof child === "object" ? child : createTextElement(child))
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function render(element, container, doc) {
  document = doc;
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  };
  nextUnitOfWork = wipRoot;
}

function createDom(bgdomnode) {
  const dom = bgdomnode.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(bgdomnode.type);
  Object.keys(bgdomnode.props).filter(key => key !== "children").forEach(name => {
    dom[name] = bgdomnode.props[name];
  });
  return dom;
}

function performWork(workItem) {
  // step 1. if the workitem has a dom, create the dom into the dom property
  if (!workItem.dom) {
    workItem.dom = createDom(workItem);
  } // step 1. append the dom to the parents (earlier created dom) dom
  // if (workItem.parent) { workItem.parent.dom.appendChild(workItem.dom) }
  // step 2. create a workItem for each child in our props of elements 


  const elements = workItem.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newWorkItem = {
      type: element.type,
      props: element.props,
      parent: workItem,
      dom: null
    };
    if (index === 0) workItem.child = newWorkItem;else prevSibling.sibling = newWorkItem;
    prevSibling = newWorkItem;
    index++;
  } // step 3. go one level deeper and set this workItem as the active one


  if (workItem.child) {
    return workItem.child;
  } // step 3. is we are already at the bottom, traverse all of its siblings or all of the parents siblings


  let nextWorkItem = workItem;

  while (nextWorkItem) {
    if (nextWorkItem.sibling) {
      return nextWorkItem.sibling;
    }

    nextWorkItem = nextWorkItem.parent;
  }
}

let wipRoot = null; // <-- added 

let document = null; // the actual DOM

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    syncDOM();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function syncDOM() {
  console.log("done rendering, lets sync..");
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(workItem) {
  // if we are done, return...
  if (!workItem) return; // append the created node to the parent node..

  workItem.parent.dom.appendChild(workItem.dom); // recursively add generated nodes to the tree

  commitWork(workItem.child); // add the siblings as well..

  commitWork(workItem.sibling);
}

export default MyReact;