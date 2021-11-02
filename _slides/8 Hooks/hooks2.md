# Hooks

---
### Hooks

Hooks are a new addition in React 16.8

They let you use state and other React features without writing a class


---
### Hooks example
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

---
### No Breaking Changes
Hooks are
- Completely opt-in
- 100% backwards-compatible


There are no plans to remove classes from React!

---
### Hooks and React Concepts

Hooks also provide direct API to the React concepts 
- props
- state
- context
- refs
- lifecycle

Hooks offer a new powerful way to combine them

---
### Motivation
Hooks solve problems in React 
- Hard to reuse stateful logic between components
- Complex components become hard to understand

Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data), rather than forcing a split based on lifecycle methods

---
### To Summarize

Classes don’t minify very well, and they make hot reloading flaky and unreliable. Functions are more optimizable and hooks let you use more of React’s features without classes

Lets explore the basic hooks..