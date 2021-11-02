# Create React reconciliation

### Step 1. Make a more efficient DOM reconciler

Our react is productive but we only add stuff to the dom, we do not reflect changes at all.

This would not perform in real life.

Changing and updating and even removing nodes might seem trivial, but we have to take into account that
the DOM already has nodes and we want to keep them if possible, remove them or replace them when needed.

This syncing is called `reconcilitation`!

To see changes in the current background DOM (wipRoot) and the last rendered DOM (previousRoot) we need to keep track of the last synced root. 

Open the MyReact.js file in the src folder and at the bottom, before the export, add the following code:
```
function syncDOM(){
    console.log("done rendering, lets sync..");
    commitWork(wipRoot.child);
    previousRoot = wipRoot;   // <-- added
    wipRoot = null;
}
```
Also add the previousRoot to the list of globals, just above the declaration of wipRoot:
```
let previousRoot = null;  /// <-- added
let wipRoot = null;
```

Next, lets add the previousRoot to the render function, we need it later to compare workItems.

Change the code in the MyReact.js for the render function to be this:

```
function render(element, container, doc) {
    document = doc;
    wipRoot = {
      dom: container,
      alternate: previousRoot, // <-- added...
      props: {
        children: [element],
      },
    }
    nextUnitOfWork = wipRoot;
  }
```

### Step 2. A little refactor

To make things more readable, lets extract the code that creates workItems to use its own function.

Make a function syncChildren into the MyReact.js code in the src directory, it is the following code:

```
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
        
        if (oldWorkItem) { oldWorkItem = oldWorkItem.sibling }    // <-- changed code end
        if (index === 0) workItem.child = newWorkItem 
        else prevSibling.sibling = newWorkItem
        prevSibling = newWorkItem
        index++
    }
}
```

We loop through the oldWorkItems and the current elements simulanously. We can compare them and make workItems to effect the change.

We now compare the previous rendered workItem with the current element, if they have the same type, we update the node. 

If they are different, we replace the workItem with a new one.. The old ones that are not needed anymore are added to a list of
deletions.

### Step 3. Remember the deleted ones?

We need to keep track of the deleted workItems, so lets add this to the root of the wip tree.

Change the render function so it looks like this:
```
function render(element, container, doc) {
    document = doc;
    wipRoot = {
      dom: container,
      alternate: previousRoot,
      props: {
        children: [element],
      },
    }    
    deletions = [];      // <-- added...
    nextUnitOfWork = wipRoot;
  }
```

And add the deletions to the list of globals, just above the previousRoot:\
```
let deletions = null; // <-- added 
let previousRoot = null;  
let wipRoot = null;    
let document = null; 
```

Since we now have a list of items to delete, make sure to call them and get rid of them.
Change the syncDom function so it looks like this:
```
function syncDOM(){
    deletions.forEach(commitWork)   // <-- added
    console.log("done rendering, lets sync..");
    commitWork(wipRoot.child);
    previousRoot = wipRoot;
    wipRoot = null;
}
```

### Step 4. Effectuate the changes.. 

Lets go to the commitWork function to handle all the effects that were calculated.

Replace the commitWork function with the implementation below:
```
function commitWork(workItem) {
    // if we are done, return...
    if (!workItem) return;
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
```

See the call to 'updateDom', hang on, we are nearly there.. we have to make this function so we can update the dom.

Create a new function in the bottom of the file, just above the export line, paste in this code:

```
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
​
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
```

Ok so now we can update earlier nodes, but wait, we are not done yet!

Since we have an updateDom function now, lets change the createDom to use the updateDom function as well.

Change the createDom to implement the code below:

```
  function createDom(bgdomnode) {
    const dom =
    bgdomnode.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(bgdomnode.type)
    
    updateDom(dom, {}, bgdomnode.props)  // <-- changed
    return dom;
  }
```

### Step 5. Use the syncChildren we have created earlier
The last step, we can update the performWork to use the syncChildren call.

This glues all the steps we have done before. Change the performWork to call the syncChildren:

```
function performWork(workItem){
    // step 1. if the workitem has a dom, create the dom into the dom property
    if (!workItem.dom) { workItem.dom = createDom(workItem) }

    // step 2. create a workItem for each child in our props of elements 
    const elements = workItem.props.children
    syncChildren(workItem, elements)                    // <-- change

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

Transpile the code and run it afterwards with
```
npm start
```

Check to see if everything works.

Congrats, you have built your first reconciler.. (i guess)




