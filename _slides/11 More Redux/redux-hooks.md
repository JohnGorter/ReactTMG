# React Redux with hooks
React Redux is the official React UI bindings layer for Redux

---
### Installation​
prerequisite
- React Redux 7.1+ requires React 16.8.3 or later
- this is because of React Hooks

---
### Using Create React App​
The recommended way to start new apps with React and Redux 
- use the official Redux+JS template or Redux+TS template 

this takes advantage of Redux Toolkit and React Redux's integration with React components

---
### Redux + Plain JS template
to start
```
npx create-react-app my-app --template redux
```

---
### Redux + TypeScript template
to start with typescript
```
npx create-react-app my-app --template redux-typescript
```

---
### An Existing React App​
To use React Redux with your React app, install it as a dependency:

```
npm install redux react-redux 
```

or with yarn
```
yarn add redux react-redux
```

You'll also need to set up a Redux store in your app.

---
### TypeScript

If you are using TypeScript, the React Redux types are maintained separately in DefinitelyTyped

```
npm install @types/react-redux
```

---
### API Overview​

React Redux includes a `Provider` component, which makes the Redux store available to the rest of your app
```
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```

---
### Consuming through hooks

React Redux provides React hooks that allow your React components to interact with the Redux store
- useSelector reads a value from the store state and subscribes to updates
- useDispatch returns the store's dispatch method to let you dispatch actions

```
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      {/* omit additional rendering output here */}
    </div>
  )
}
```

---
### the complete setup
- install Redux Toolkit and React Redux​
- create a Redux Store​

---
### Install Redux Toolkit and React Redux​
```
npm install @reduxjs/toolkit react-redux
```

---
### Create a Redux Store​
Create a file named src/app/store.js

Import the configureStore API from Redux Toolkit. 

We'll start by creating an empty Redux store, and exporting it:

```
// app/store.js
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {},
})
```

---
### Provide the Redux Store to React​
Once the store is created, make it available to the React components
```
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

---
### Create a Redux State Slice​
Add a new file named src/features/counter/counterSlice.js

In that file, import the createSlice API from Redux Toolkit.

Creating a slice requires 
- a string name to identify the slice
- an initial state value
- one or more reducer functions to define how the state can be updated

Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice

---
### Create a Redux State Slice​
```
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

---
### Add Slice Reducers to the Store​
Import the reducer function from the counter slice and add it to our store
```
// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

---
### Use Redux State and Actions in React Components​
Now use the React Redux hooks to let React components interact with the Redux store

We can 
- read data from the store with useSelector
- dispatch actions using useDispatch

```
// features/counter/Counter.js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```

---
### Recap
Now, any time you click the "Increment" and "Decrement buttons:
- the corresponding Redux action will be dispatched to the store
- the counter slice reducer will see the actions and update its state
- the `Counter` component will see the new state value from the store and re-render itself with the new data

---
### Summary steps
- create a Redux store with configureStore
- configureStore accepts a reducer function as a named argument
- configureStore automatically sets up the store with good default settings
- provide the Redux store to the React application components
- put a React Redux `Provider` component around your `App`
- pass the Redux store as `Provider store={store}`

---
### Summary steps
- create a Redux "slice" reducer with createSlice
- call createSlice with a string name, an initial state, and named reducer functions
- reducer functions may "mutate" the state using Immer
- export the generated slice reducer and action creators
- use the React Redux useSelector/useDispatch hooks in React components
- read data from the store with the useSelector hook
- get the dispatch function with the useDispatch hook, and dispatch actions as needed

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using react-redux

---

<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Create a todo application using react-redux

npx create-react-app redux-essentials-example --template redux