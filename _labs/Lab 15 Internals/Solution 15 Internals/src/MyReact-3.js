const requestIdleCallback = require('ric-shim');

const MyReact = {
    createElement,
    render
}

function createElement(elementType, properties, ...content) {
    if (elementType instanceof Function) return elementType(properties);
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

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
        nodeValue: text,
        children: [],
        },
    }
}

function render(element, container, doc) {
    document = doc;
    wipRoot = {
      dom: container,
      alternate: previousRoot,
      props: {
        children: [element],
      },
    }    
    deletions = [],         // <-- added...
    nextUnitOfWork = wipRoot;
  }

  function createDom(bgdomnode) {
    const dom =
    bgdomnode.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(bgdomnode.type)
    
    updateDom(dom, {}, bgdomnode.props)
    return dom;
  }

function performWork(workItem){
    // step 1. if the workitem has a dom, create the dom into the dom property
    if (!workItem.dom) { workItem.dom = createDom(workItem) }
    // step 1. append the dom to the parents (earlier created dom) dom
    // if (workItem.parent) { workItem.parent.dom.appendChild(workItem.dom) }

    // step 2. create a workItem for each child in our props of elements 
    const elements = workItem.props.children
    syncChildren(workItem, elements)

    // step 3. go one level deeper and set this workItem as the active one
    if (workItem.child) { return workItem.child }
    // step 3. is we are already at the bottom, traverse all of its siblings or all of the parents siblings
    let nextWorkItem = workItem
    while (nextWorkItem) {
        if (nextWorkItem.sibling) { return nextWorkItem.sibling }
        nextWorkItem = nextWorkItem.parent
    }

}

function syncChildren(workItem, elements) {
    let index = 0
    // grab the previous created workItem
    let oldWorkItem = workItem.alternate && workItem.alternate.child  // <-- newly added code
    let prevSibling = null
    while (index < elements.length || oldWorkItem != null) {      // <-- changed code
        const element = elements[index]
        let newWorkItem = null;                                   // <-- changed code start
        const sameType = element && oldWorkItem && element.type == oldWorkItem.type;
        // compare the old workItem with the current element
        if (sameType) {
          // update the node in DOM
          newWorkItem = { type: oldWorkItem.type, props: element.props, dom: oldWorkItem.dom, parent: workItem, alternate: oldWorkItem, effectTag: "UPDATE" }
        }
        if (element && !sameType) {
          // add the node to DOM
           newWorkItem = { type: element.type, props: element.props, dom: null, parent: workItem, alternate: null, effectTag: "INSERT" }
        }
        if (oldWorkItem && !sameType) {
          // remove the oldWorkItem from DOM
          oldWorkItem.effectTag = "DELETE"
          deletions.push(oldWorkItem)
        }
        // console.log("adding a workitem", newWorkItem)
        if (oldWorkItem) { oldWorkItem = oldWorkItem.sibling }    // <-- changed code end
        if (index === 0) workItem.child = newWorkItem 
        else prevSibling.sibling = newWorkItem
        prevSibling = newWorkItem
        index++
    }
}

let deletions = null; // <-- added 
let previousRoot = null;  
let wipRoot = null;    
let document = null;   

let nextUnitOfWork = null;
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
   syncDOM()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function syncDOM(){
    deletions.forEach(commitWork)
    console.log("done rendering, lets sync..");
    commitWork(wipRoot.child);
    previousRoot = wipRoot;
    wipRoot = null;
}

function commitWork(workItem) {
    // if we are done, return...
    if (!workItem) return;
    // switch over the options here... add, change or removing items..
    const domParent = workItem.parent.dom
    // switch over the options here... add, change or removing items..
    if (workItem.effectTag === "INSERT" && workItem.dom != null) {
        domParent.appendChild(workItem.dom)
    } else if (workItem.effectTag === "UPDATE" && workItem.dom != null) {
        updateDom(workItem.dom, workItem.alternate.props, workItem.props)
    } else if (workItem.effectTag === "DELETE") { 
        domParent.removeChild(workItem.dom)
    }
    // recursively add generated nodes to the tree
    commitWork(workItem.child);
    // add the siblings as well..
    commitWork(workItem.sibling);
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
  .filter(isEvent)
  .filter( key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
  .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {  dom[name] = "" })
    
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => { dom[name] = nextProps[name] })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}
export default MyReact