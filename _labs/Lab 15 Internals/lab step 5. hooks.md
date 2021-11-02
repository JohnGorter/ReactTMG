# Create hooks like in React

### Step 1. Add hooks support

So we have functional components now, why not try to add state through hooks.

Lets change the application so in has a counter, with which we can explore state. If we want to play around, we have to execute the code in a browser.

Follow the steps below to make it so it runs in the browser:
1. change the presets
```
{
  "presets": ["@babel/preset-react"]
}
```
2. remove the jsdom, in the index.js file copy the following
```
/** @jsx MyReact.createElement */
import MyReact from './MyReact.js'

const MyApp = () => {
    const [state, setState] = MyReact.useState(1);
    return <div onClick={() => setState(c => c + 1)}> Count: { state } </div>
}
MyReact.render(<MyApp />, document.querySelector("#container"), document)  
```
3. remove the ric-shim, in the MyReact.js file, comment the following line at the top:
```
// const requestIdleCallback = require('ric-shim');
```
4. add a html file that starts the code.
In the public folder, add an index.html file with the following contents:
```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="container"></div>
        <script src="./index.js" type="module"></script>
    </body>
    </html>
```

That should do the trick.

Transpile the code and see if there are no errors.

To start a webserver in the public folder, navigate to the public folder and run lite-server. Execute this in one command like below:
```
cd ./public && npx lite-server
```

If all went well, we should see a browser. It shows a blank screen, if you open the console, you see
this error:
```
index.js:5 Uncaught TypeError: MyReact.useState is not a function or its return value is not iterable
    at Object.MyApp [as type] (index.js:5)
    at performWork (MyReact.js:55)
    at workLoop (MyReact.js:154)
```

In this lab, we are going to implement useState

### Step 2. Create useState

Open the MyReact.js in the src folder, add the useState function to the constant MyReact:
```
const MyReact = {
    createElement,
    render,
    useState
}
```

The useState function is called when the functional component is executed, so lets go to the code that calls the functional component. 

Add the following code to the performWork function:
```
let wipWorkItem = null;  // <-- added
let hookIndex = null;    // <-- added

function performWork(workItem){
    // check to see if this is a functional component
    const isFunction = workItem.type instanceof Function;
    if (isFunction) {
        wipWorkItem = workItem  // <-- added
        hookIndex = 0;          // <-- added
        wipWorkItem.hooks = []; // <-- added
        const children = [workItem.type(workItem.props)];
        syncChildren(workItem, children)
    }
```

So now when the functional component calls useState, we can get the previous state from 
the hooks array we remembered earlier.. This should be an array because the funcional component can have multiple useState calls inside it's definition.

Now we can implement the useState function, copy this function over to somewhere in your MyReact.js file in the src folder of the project:

```
function useState(initial) {
    // get the previous hook at the current index (should start at 0 for the first call)
    const oldHook = wipWorkItem.alternate && wipWorkItem.alternate.hooks && wipWorkItem.alternate.hooks[hookIndex]
    // create the new hook for the next round, giving it the initial or the previous value
    const hook = { 
        state: oldHook ? oldHook.state : initial,
        queue: []
    }
    // check the actions queue of the old hook, this could be filled with work
    const actions = oldHook ? oldHook.queue : []
    // trigger the actions, changing the current hook state...
    actions.forEach(action => { hook.state = action(hook.state) })

    // create the setState function so that the call is remembered
    // for the next iteration, then schedule a refresh to happen
    // this triggers the code above to be called to update the state
    const setState = action => {
        hook.queue.push(action)
        wipRoot = {
          dom: previousRoot.dom,
          props: previousRoot.props,
          alternate: previousRoot,
        }
        nextUnitOfWork = wipRoot
        deletions = []
    }
    // push the new hook with the new state and work to the 
    // current hook collection (which is initialized as [] upon creation)
    wipWorkItem.hooks.push(hook)
    // increment the hookIndex when the useState is called again. Then
    // we want a the previous first hook that was pushed earlier...
    hookIndex++
    // expose/return a hook.state and setState function as a result
    return [hook.state, setState]
}
```
I have included comment to explain the different parts of the function.

To be complete lets get over what happens.

So what is happening here?
We expose a useState function. 

This function is called whenever the functional component is executed.

Upon execution, this current workItem is remembered globally and the hookIndex is set to 0.

So when the useState is called, we try to get the previous hooks array (at current index 0). 

If this exists, we use this hook otherwise we create a new one and add it to the list of hooks.

We execute the queued actions from the hook and update its state, this is returned at the end.

We also expose a setState function that enqueues the action to take on the next refresh/re-render and when the functional component is re-rendered.

We grab the hook, get the actions create a new hook, add it to the hooks array for the next round and return the new state and a setState function.

Let it sink in for a moment.

Then transpile this code and run it.

First, transpile the code:
```
./node_modules/.bin/babel src --out-dir public
```

then cd into the public folder and execute:
```
npx lite-server
```

Play around and see if everything works!

If your application is not working nice and stutters, try the code below for the workLoop
```
function workLoop() {
  while (nextUnitOfWork) { 
    nextUnitOfWork = performWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
   syncDOM()
  }
  requestAnimationFrame(workLoop)
}
requestAnimationFrame(workLoop)
```

React uses its own scheduler to make this work better.. 

Congrats you made it to the end! 


Want to read further:
https://github.com/acdlite/react-fiber-architecture

