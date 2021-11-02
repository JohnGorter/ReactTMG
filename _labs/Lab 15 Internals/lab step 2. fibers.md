# Workitems to the rescue (fibers)

### Step 1. Get rid of the recursiveness

There is a recursive render function that could potentially block our frame rendering.

We dont want that!
If the tree is to big it takes simply to long.

Lets refactor our code so the recursive rendering is broken down into two steps:
- building a tree of work
- rendering the dom

### Step 2. building the tree of work
Lets make a fake DOM,walking each node in the elementtree and scheduling each node in a loop
building up this temporary fake DOM.

We use the `requestIdelCallback` to schedule a piece of work on each possible callback.

Then we render each node to a DOM node at a time. 

Since we are executing in NodeJS, we do not have a `requestIdleCallback` function. 

Lets add that through a shim first:

```
npm i ric-shim --save-dev
```

Now we can use the idleloop inside NodeJS. 

Add the folling code to the MyReact.js file in the src directory:
```
const requestIdleCallback = require('ric-shim');
```

We can implement work scheduling now!

### Step 3. implementing the work loop

The basic loop is implemented with the code below, add this to your MyReact.js file:
```
let document = null;
let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
​
function performWork(nextUnitOfWork) {
  // TODO
}
```

To start using the loop we’ll need to set the first unit of work, and then write a performUnitOfWork function that not only performs the work but also returns the next unit of work.

The global document is needed because we run in NodeJS. It is filled later, don't worry for now.

In the render we set the first unitOfWork, then in the performUnitOfWork, we traverse the nodes downwards and sideways.

For each workItem we do the following:
1. add the element to the DOM
2. create the workitems for the element’s children
3. select the next unit of work

To implement this, first lets change the render function only set the first unit of work that triggers the loop.
In your MyReact.js code, change the render function to this function:

```
function render(element, container, doc) {
    document = doc;
    nextUnitOfWork = {
      dom: container,
      props: {
        children: [element],
      },
    }
  }
```

So the render function does nothing more than setting the nextUnitOfWork with an object that has a domNode and properties.
As said before, this triggers the loop. 

Now we have to! add the function to create a domNode. This code earlier was the responsibility of the render, but now it is copied over to its own function, we have to create nodes in the workItem loop for each work item in the linked list.

Add the following function below the render function in the MyReact.js file in the src directory:

```
function createDom(node) {
    const dom =
    node.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(node.type)
    Object.keys(node.props)
      .filter(key => key !== "children")
      .forEach(name => { dom[name] = node.props[name]})
    return dom
  }
```

You should recognize this code as it was first part of the render loop!

### Step 4. implementing the performWork 
The last step is to implement the performWork function, as said earlier, this function has the following responsibilities:
1. add the element to the DOM
2. create the workitems for the element’s children
3. select the next unit of work

Copy the following function into the MyReact.js in the src folder from your project:
```
function performWork(workItem){
    // step 1. if the workitem has a dom, create the dom into the dom property
    if (!workItem.dom) { workItem.dom = createDom(workItem) }
    // step 1. append the dom to the parents (earlier created dom) dom
    if (workItem.parent) { workItem.parent.dom.appendChild(workItem.dom) }

    // step 2. create a workItem for each child in our props of elements 
    const elements = workItem.props.children
    let index = 0
    let prevSibling = null
    while (index < elements.length) {
        const element = elements[index]
        const newWorkItem = { type: element.type, props: element.props, parent: workItem, dom: null }
        if (index === 0) workItem.child = newWorkItem 
        else prevSibling.sibling = newWorkItem
        prevSibling = newWorkItem
        index++
    }
    // step 3. go one level deeper and set this workItem as the active one
    if (workItem.child) { return workItem.child }
    // step 3. is we are already at the bottom, traverse all of its siblings or all of the parents siblings
    let nextWorkItem = workItem
    while (nextWorkItem) {
        if (nextWorkItem.sibling) { return nextWorkItem.sibling }
        nextWorkItem = nextWorkItem.parent
    }
}
```
I have commented the code so each step is documented, read this when you copy the code.

With this in place, transpile and run your code, the output should be this:
```
elementtree {"type":"div","props":{"id":"test","children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"title":"title","children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"my react text","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"></div></body></html>
```

Notice that the elementtree is in tact, but now the rendered HTML is empty. This is because we offload the rendering of the dom as scheduled work.

Change the code in your index.js to add this line as the last line of the file:
```
setTimeout(() => {
    console.log("elements", dom.serialize());
}, 1000);
```

Re transpile your code and execute it again.. Now the output is this:
```
elementtree {"type":"div","props":{"id":"test","children":[{"type":"h1","props":{"children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"Hello MyReact","children":[]}}]}},{"type":"p","props":{"title":"title","children":[{"type":"TEXT_ELEMENT","props":{"nodeValue":"my react text","children":[]}}]}}]}}
elements <html><head></head><body><div id="container"></div></body></html>
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">my react text</p></div></div></body></html>
```

So it worked, but it took a while to finish.. 

### Step 5. Rendering in a background DOM

If this rendering would have lots of elements, we would see the DOM change before our eyes. 

We do not want that, so instead of 
directly rendering to the DOM, lets render the workitems in a wipDOM (workInProgress). Afterwards, we can then sync this wipDOM
with the actual DOM. 

We call this syncing the commit phase.

Lets comment out the code that adds the nodes to the document directly, we want to postpone this to the end of the rendering phase
Change the performWork function, comment out the following code:
```
// step 1. if the workitem has a dom, create the dom into the dom property
    if (!workItem.dom) { workItem.dom = createDom(workItem) }
    // step 1. append the dom to the parents (earlier created dom) dom
    // if (workItem.parent) { workItem.parent.dom.appendChild(workItem.dom) }   // <-- this is now comment
```

Lets keep track of the work in progress by assigning the root to a global called `wipRoot`.

Change the render function in MyReact.js in the src folder:
```
function render(element, container, doc) {
    document = doc;
    wipRoot = {                 // <-- change
      dom: container,
      props: {
        children: [element],
      },
    }
    nextUnitOfWork = wipRoot;   // <-- change
  }
```

Also add the wipRoot to the MyReact.js page, just above the document declaration:
```
let wipRoot = null;   // <-- added 
let document = null;
...
```

After the whole tree is processed, we can sync the changes into the DOM. 

Change the workLoop and add the following code:

```
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {          // <-- added
    syncDOM()                                // <-- added
  }                                          // <-- added
  requestIdleCallback(workLoop)
}
```

This calls the syncDOM if we are done travering the tree..
We have to implement the syncDOM function of course...

Open the MyReact.js file in the src folder and at the bottom, before the export, add the following code:
```
function syncDOM(){
    console.log("done rendering, lets sync..");
    commitWork(wipRoot.child);
    wipRoot = null;
}

function commitWork(workItem) {
    // if we are done, return...
    if (!workItem) return;
    // append the created node to the parent node..
    workItem.parent.dom.appendChild(workItem.dom);
    // recursively add generated nodes to the tree
    commitWork(workItem.child);
    // add the siblings as well..
    commitWork(workItem.sibling);
}
```

Again this code is documented, so read it please.

This code adds all the generated nodes to DOM in one recursivly way (note that it is still recursive but the work has already been done).

Save this code and transpile and run it.. It still should work as before, but now we do not render directly to the dom. 
Instead we render afterwards in the commit step!

The output should be as follows:
```
elements <html><head></head><body><div id="container"></div></body></html>
done rendering, lets sync..
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">my react text</p></div></div></body></html>
```

Notice how we sync afterwards..

Congrats, you have implemented fibers as alternative to stack based reconciliation!



