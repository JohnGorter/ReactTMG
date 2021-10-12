# Hooks 

---
### Hooks

Hooks are 
- new addition in React 16.8
- let you use state and other React features without writing a class

Hooks are backwards-compatible

---
### State Hook
This example renders a counter. When you click the button, it increments the value:
```
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

useState is a Hook
- React will preserve this state between re-renders
- the initial state argument is only used during the first render

--
## Declaring multiple state variables
You can use the State Hook more than once in a single component
```
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

React assumes that if you call useState many times, you do it in the same order during every render!

---
### What is a Hook?

Hooks are functions that let you “hook into” React state and lifecycle features from function components

Hooks don’t work inside classes 

---
### Built-in Hooks

React provides a few built-in Hooks 
- useState
- useEffect

You can also create your own Hooks to reuse stateful behavior between different components

---
### Effect Hook

You’ve likely performed data fetching, subscriptions, or manually changing the DOM from React components before
- these operations are “side effects” (or “effects” for short) 
- they can affect other components and can’t be done during rendering

The Effect Hook, useEffect, adds the ability to perform side effects from a function component. 

It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API


---
### useEffect example
This component sets the document title after React updates the DOM
```
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

---
### useEffect

When you call useEffect, you’re telling React to run your “effect” function after flushing changes to the DOM.

Effects are declared inside the component 
- they have access to its props and state

By default, React runs the effects after every render 
- this includes the first render

---
### useEffect
Effects may also optionally specify how to “clean up” after them by returning a function. 

Example For example, this component uses an effect to subscribe to a friend’s online status, and cleans up by unsubscribing from it
```
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

---
### useEffect

Just like with useState, you can use more than a single effect in a component
```
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

---
### Hooks

Hooks let you organize side effects in a component by what pieces are related (such as adding and removing a subscription), rather than forcing a split based on lifecycle methods.


---
### Rules of Hooks
Hooks are JavaScript functions, but they impose two additional rules

- only call Hooks at the top level
    - don’t call Hooks inside loops, conditions, or nested functions
- only call Hooks from React function components
    - don’t call Hooks from regular JavaScript functions 
    
---
### Building Your Own Hooks
Sometimes, we want to reuse some stateful logic between components
 
Traditionally, there were two popular solutions to this problem
- higher-order components 
- render props

Custom Hooks let you do this, but without adding more components to your tree

---
### Example 

Earlier, a FriendStatus component that calls the useState and useEffect Hooks to subscribe to a friend’s online status

To reuse this subscription logic in another component
- first, extract this logic into a custom Hook

```
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

---
### Example 

- second, use it in components
```
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

---
### Example 
Important: 
- the state of each component is completely independent
    - you can even use the same custom Hook twice in one component

---
### Custom Hooks
Custom Hooks are more of a convention than a feature
- if function’s name starts with ”use” and calls other Hooks it is a custom Hook
- the useSomething naming convention is how the linter plugin is able to find bugs in the code using Hooks


---
### Other Hooks
There are a few less commonly used built-in Hooks 
- useContext -> lets you subscribe to React context without introducing nesting
```
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```
- useReducer -> lets you manage local state of complex components with a reducer
```
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```


---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Hooks


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Hooks