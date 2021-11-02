# Create function components

### Step 1. Add functional components

So we have the core of react running.. Lets add a better implementation of function components..

Our previous version of the functional component was kind of a hack. It only executes once but never thereafter...
Lets make this better, we have to execute functional components upon each render, as promised..

So comment out the earlier code that executed the functional component
```
function createElement(elementType, properties, ...content) {
    // if (elementType instanceof Function) return elementType(properties);  // <-- comment now>
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

The real place to execute this code is inside the render or better, inside the `performUnitOfWork`:
```
function performWork(workItem){
    // check to see if this is a functional component
    /* new part */
    const isFunction = workItem.type instanceof Function;
    if (isFunction) {
        const children = [workItem.type(workItem.props)];
        syncChildren(workItem, children)
    }
    else
    {
        // step 1. if the workitem has a dom, create the dom into the dom property
        if (!workItem.dom) { workItem.dom = createDom(workItem) }
        // step 2. create a workItem for each child in our props of elements 
        const elements = workItem.props.children
        syncChildren(workItem, elements)
    }
    /* end new part */
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

If you were to run this, if would result in the following error:
```
/Users/johngorter/Desktop/myreact/myreact/public/MyReact.js:206
    domParent.appendChild(workItem.dom);
              ^
```

You can try it if you want.. 

With functional components, we have workitems without a dom node in the tree, that does not work because commitWork adds the domnode to a parents dom. 

Lets change the commitWork code so we walk up the parent untill we find a dom node.

Open the MyReact.js file and change the commitWork function for this change:
```
    
    // const domParent = workItem.parent.dom    // <-- this is comment now
    // switch over the options here... add, change or removing items..
    let domParentTemp = workItem.parent         // <-- appended
    while (!domParentTemp.dom) {                // <-- appended
        domParentTemp = domParentTemp.parent    // <-- appended
    }                                           // <-- appended
    const domParent = domParentTemp.dom         // <-- appended

```


Try the code again, now it should work

the output is
```
elementtree {"props":{"mytext":"my react text","children":[]}}
elements <html><head></head><body><div id="container"></div></body></html>
done rendering, lets sync..
elements <html><head></head><body><div id="container"><div id="test"><h1>Hello MyReact</h1><p title="title">my react text</p></div></div></body></html>
```

We can now use functional component in our own version of React.

Congrats you have made it this far!

