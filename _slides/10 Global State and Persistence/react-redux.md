# React-Redux


---
### React-Redux

React-Redux simplifies Redux by:
- using props again and inject the store!
- mapping the store to props

---
### Step 1: Import Redux NPM packages
first install 
```
npm install redux react-redux
```

---
### Step 2: Create a Reducer
Create a function that manipulates the store
- called a reducer


A reducer is a pure function that accepts 2 parameters
- state -> State can be anything, including objects
- action -> Action is an object with type property that specifies the type of action as a string

---
### Step 2: Create a Reducer
Let's create a countReducer in src/index.js
```
src/index.js
const countReducer = function (state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};
```


---
### Step 3: Create a Redux Store
The store holds the state as one big global object known as a state tree. The store allows us to:
- dispatch actions to modify the state
- subscribe to recieve notification about state changes
- retrieve the entire state tree

Let's import and create the redux store and use our reducer to initialize it
```
src/index.js
...
import { createStore } from 'redux';
...
let store = createStore(countReducer);
...
```

---
### Step 4: Wrap the Main App Component with Provider
Now, we will connect redux to react using the NPM library react-redux. Let's import the Provider 

```
src/index.js
...
import { Provider } from 'react-redux';
...
const App = () => (
  <Provider store={store}>
    <h1>Helloworld React & Redux!</h1>
  </Provider>
);
ReactDOM.render(<App />, document.getElementById('root'));
```

The Provider will supply our entire component tree with the global state tree.

---
### Step 5: Create and Connect a Container Component
In the world of React & Redux, Container (smart) Components are responsible for pulling state from the Redux store, transforming it, and passing it down to Presentational (dumb) Components

Let's convert our h1 tag into a Container Component
```
src/index.js
...
import { Provider, connect } from 'react-redux';
...
const Component = () => <h1>Helloworld React & Redux!</h1>;

const Container = connect()(Component);

const App = () => (
  <Provider store={store}>
    <Container />
  </Provider>
);
...
```

---
### Step 6: Select and Transform State from Redux Store
Let's use our Container component to select the state and optionally, transform it.
```
src/index.js
...
const mapStateToProps = state => {
  return {
    count: state
  };
};
const Container = connect(mapStateToProps)(Component);
...
```

Here, we define a new function called mapStateToProps that literally maps or links the state from the Redux store to the component props we wish to pass to our downstream component

---
### Step 7: Use the State in the Presentational Component
The count prop is now being passed to our Component. Let's declare it as our parameter, and add it to the JSX. The sore responsibility of the Presentational Component is to convert props into JSX with little or no logic.
```
src/index.js
const Component = ({count}) => <h1>Helloworld React & Redux! {count}</h1>;
```

---
### Step 8: Add Buttons to our Presentational Component
Now, we're going to add two buttons in our Presentational Component that increment and decrement the count.

```
src/index.js
const Component = ({count, handleIncrementClick, handleDecrementClick}) => (
  <div>
    <h1>Helloworld React & Redux! {count}</h1>
    <button onClick={handleDecrementClick}>Decrement</button>
    <button onClick={handleIncrementClick}>Increment</button>
  </div>
);
```
Notice that we are passing the two click handlers as props to the two buttons. We will provide these callbacks from the Container for dispatching actions to the Redux store

---
### Step 9: Pass Callback that Dispatch Actions to Store
It's time to map our store dispatch to callback functions. Here's the change:

```
src/index.js
const mapDispatchToProps = dispatch => {
  return {
    handleIncrementClick: () => dispatch({ type: 'INCREMENT' }),
    handleDecrementClick: () => dispatch({type: 'DECREMENT'})
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Component);
```

We pass a second function called mapDispatchToProps to our connect function in the Container component

---
### More info here

https://www.valentinog.com/blog/redux/


---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Redux Demo


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
React Redux Demo
