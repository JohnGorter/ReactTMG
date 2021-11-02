# Redux thunk

---
### Redux thunk

Most real applications need to work with data from a server, by making HTTP API calls to fetch and save items

---
### Redux Middleware and Side Effects​
By itself, a Redux store doesn't know anything about async logic

It only knows how to synchronously 
- dispatch actions
- update the state by calling the root reducer function
- notify the UI that something has changed

Any asynchronicity has to happen outside the store


---
###  Reducer rules
Redux reducers must never contain "side effects"
 
> A "side effect" is any change to state or behavior that can be seen outside of returning a value from a function

Some common kinds of side effects are things like
- logging a value to the console
- saving a file
- setting an async timer
- making an AJAX HTTP request
- modifying some state that exists outside of a function
- generating random numbers or unique random IDs

---
### Middleware
If we can't put side effects in reducers, where can we put them?
- Redux middleware

> Redux middleware can do anything when it sees a dispatched action: log something, modify the action, delay the action, make an async call, and more.


---
### Middleware
Middleware also have access to dispatch and getState
- write some async logic in a middleware
- have the ability to interact with the Redux store by dispatching actions

---
### Middleware example
```
import { client } from '../api/client'

const delayedActionMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      // Delay this action by one second
      next(action)
    }, 1000)
    return
  }

  return next(action)
}

const fetchTodosMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/fetchTodos') {
    // Make an API call to fetch todos from the server
    client.get('todos').then(todos => {
      // Dispatch an action with the todos we received
      storeAPI.dispatch({ type: 'todos/todosLoaded', payload: todos })
    })
  }

  return next(action)
}
```

---
### Another example async function middleware
```
const asyncFunctionMiddleware = storeAPI => next => action => {
  // If the "action" is actually a function instead...
  if (typeof action === 'function') {
    // then call the function and pass `dispatch` and `getState` as arguments
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // Otherwise, it's a normal action - send it onwards
  return next(action)
}
```
And then use that middleware like this:
```
const middlewareEnhancer = applyMiddleware(asyncFunctionMiddleware)
const store = createStore(rootReducer, middlewareEnhancer)

// Write a function that has `dispatch` and `getState` as arguments
const fetchSomeData = (dispatch, getState) => {
  // Make an async HTTP request
  client.get('todos').then(todos => {
    // Dispatch an action with the todos we received
    dispatch({ type: 'todos/todosLoaded', payload: todos })
    // Check the updated store state after dispatching
    const allTodos = getState().todos
    console.log('Number of todos after loading: ', allTodos.length)
  })
}

// Pass the _function_ we wrote to `dispatch`
store.dispatch(fetchSomeData)
// logs: 'Number of todos after loading: ###'
```

Again, notice that this "async function middleware" let us pass a function to dispatch! 

---
### Using the Redux Thunk Middleware​
As it turns out, Redux already has an official version of that "async function middleware"
- called the Redux "Thunk" middleware

The thunk middleware 
- allows us to write functions that get dispatch and getState as arguments
- thunk functions can have any async logic we want inside, and that logic can dispatch actions and read the store state as needed

---
### Using the Redux Thunk Middleware​

> Writing async logic as thunk functions allows us to reuse that logic without knowing what Redux store we're using ahead of time

---
### Thunks in Redux: the basics
- Configuring the Store​

The Redux thunk middleware is available on NPM as a package called redux-thunk. We need to install that package to use it in our app
```
npm install redux-thunk
```
Once installed, update the Redux store in our todo app to use that middleware:
```
// src/store.js
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

// The store now has the ability to accept thunk functions in `dispatch`
const store = createStore(rootReducer, composedEnhancer)
export default store
```

---
### Fetching Todos from a Server​
Now write the thunk function in the todosSlice.js file:
```
// src/features/todos/todosSlice.js
import { client } from '../../api/client'

const initialState = []

export default function todosReducer(state = initialState, action) {
  // omit reducer logic
}

// Thunk function
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}
```

---
### Fetching Todos from a Server​
We only want to make this API call once, when the application loads for the first time 

There's a few places we could put this
- in the <App> component, in a useEffect hook
- in the <TodoList> component, in a useEffect hook
- in the index.js file directly, right after we import the store

---
### Fetching Todos from a Server​
For now, let's try putting this directly in index.js:
```
src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'

import './api/server'

import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

store.dispatch(fetchTodos)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

---
### Implement the reducer
For the state to have effect and rerender the list, we have to implement the reducer:
```
// src/features/todos/todosSlice.js
import { client } from '../../api/client'

const initialState = []

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // omit other reducer cases
    case 'todos/todosLoaded': {
      // Replace the existing state entirely by returning the new value
      return action.payload
    }
    default:
      return state
  }
}

export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}
```

---
### We could log the effect afterwards
Since dispatching an action immediately updates the store
- we can call getState in the thunk to read the updated state value after we dispatch

```
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)

  dispatch({ type: 'todos/todosLoaded', payload: response.todos })

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}
```

---
### Saving Todo Items​
We also need to update the server whenever we try to create a new todo item

We should 
- make an API call to the server with the initial data 
- wait for the server to send back a copy of the newly saved todo item
- dispatch an action with that todo item

---
### Saving Todo Items​, problem
Problem
- since we're writing the thunk as a separate function in the todosSlice.js file, the code that makes the API call doesn't know what the new todo text is supposed to be:

```
// src/features/todos/todosSlice.js
async function saveNewTodo(dispatch, getState) {
  // ❌ We need to have the text of the new todo, but where is it coming from?
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  dispatch({ type: 'todos/todoAdded', payload: response.todo })
}
```

---
### Saving Todo Items​, solution

We need a way to write a function that accepts text as its parameter, then creates the  thunk function so that it can use the text value to make the API call

```
// src/features/todos/todosSlice.js
// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch({ type: 'todos/todoAdded', payload: response.todo })
  }
}
```

---
### Saving Todo Items​, solution
Now we can use this in our `Header` component:

```
// src/features/header/Header.js
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  const handleKeyDown = e => {
    // If the user pressed the Enter key:
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // Create the thunk function with the text the user wrote
      const saveNewTodoThunk = saveNewTodo(trimmedText)
      // Then dispatch the thunk function itself
      dispatch(saveNewTodoThunk)
      setText('')
    }
  }

  // omit rendering output
}
```

---
### Saving Todo Items​, solution
Since we know we're going to immediately pass the thunk function to dispatch in the component, we can skip creating the temporary variable

```
/// src/features/header/Header.js
const handleKeyDown = e => {
  // If the user pressed the Enter key:
  const trimmedText = text.trim()
  if (e.which === 13 && trimmedText) {
    // Create the thunk function and immediately dispatch it
    dispatch(saveNewTodo(trimmedText))
    setText('')
  }
}
```

---
### Update the todos reducer

We still have to update our todos reducer

```
//src/features/todos/todosSlice.js
const initialState = []

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      // Return a new todos state array with the new todo item at the end
      return [...state, action.payload]
    }
    // omit other cases
    default:
      return state
  }
}
```

---
### Summary
- Redux middleware were designed to enable writing logic that has side effects
- "Side effects" are code that changes state/behavior outside a function
- middleware add an extra step to the standard Redux data flow
- middleware can intercept other values passed to dispatch
- middleware have access to dispatch and getState, so they can dispatch more actions as part of async logic

---
### Summary
- the Redux "Thunk" middleware lets us pass functions to dispatch
- "Thunk" functions let us write async logic ahead of time, without knowing what Redux store is being used
- a Redux thunk function receives dispatch and getState as arguments, and can dispatch actions like "this data was received from an API response"

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using thunks

---

<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Expand the todo application with thunk functions
