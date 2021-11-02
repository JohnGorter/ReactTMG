# Basic Hooks

---
### Basic Hooks

Lets explore 
- useState
- useEffect
- useContext

---
### useState Hook

```
const [state, setState] = useState(initialState);
```

Returns a stateful value, and a function to update it

```
setState(newState);
```

React guarantees that setState function identity is stable and won’t change on re-renders 


---
### useState Hook
Functional updates
- you can pass a function to setState

```
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

The ”+” and ”-” buttons use the functional form

The “Reset” button uses the normal form

---
### useState Hook

If your update function returns the exact same value as the current state, the subsequent rerender will be skipped 

useState does not automatically merge update objects!
- this is unlike the setState method in class components

You can replicate this behavior by combining the function updater form with object spread syntax:

```
const [state, setState] = useState({});
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
```

---
### Lazy initial state
The initialState argument is the state used during the initial render. 
- in subsequent renders, it is disregarded
 
If the initial state is the result of an expensive computation, provide a function
- this will be executed only on the initial render:

```
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

---
### Bailing out of a state update
If you update a State Hook to the same value as the current state, React will bail out without rendering the children or firing effects
- React uses the Object.is comparison algorithm


---
### useEffect

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (React’s render phase). 

Doing so will lead to confusing bugs and inconsistencies in the UI

Therefore use useEffect!

---
### useEffect

useEffect Accepts a function that contains imperative, possibly effectful code

```
useEffect(didUpdate);
```

The function passed to useEffect will run AFTER render


---
### Cleaning up an effect
Often, effects create resources that need to be cleaned up before the component leaves, such as a subscription or timer ID

```
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

The clean-up function runs before the component is removed to prevent memory leaks

If a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect

---
### Timing of effects

useEffect fires after layout and paint, during a deferred event
- suitable for for instance setting up subscriptions and event handlers
- most types of work shouldn’t block the browser from updating the screen

Not all effects can be deferred
- a DOM mutation that is visible to the user must fire synchronously before the next paint so that the user does not perceive a visual inconsistency

For these types of effects, use useLayoutEffect
- has the same signature as useEffect, and only differs in when it is fired

---
### Conditionally firing an effect
The default behavior for effects is to fire the effect after every completed render
- an effect is always recreated if one of its dependencies changes

However, this may be overkill in some cases
- we don’t always need to create a new subscription on every update
- only if the source prop has changed

To implement this, pass a second argument to useEffect that is the array of values that the effect depends on

```
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```
Now the subscription will only be recreated when props.source changes

---
### Conditionally firing an effect

If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array ([]) as a second argument
- tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run

If you pass an empty array ([]), the props and state inside the effect will always have their initial values!

---
### useContext

Accepts a context object (the value returned from React.createContext) 
- returns the current context value for that context

```
const value = useContext(MyContext);
```

The current context value is determined by the value prop of the nearest `MyContext.Provider` above the calling component in the tree.

---
### useContext

When the nearest `MyContext.Provider` above the component updates, this Hook will trigger a rerender with the latest context value passed to that MyContext provider

Don’t forget that the argument to useContext must be the context object itself:
```
Correct: useContext(MyContext)
Incorrect: useContext(MyContext.Consumer)
Incorrect: useContext(MyContext.Provider)
```

A component calling useContext will always re-render when the context value changes

---
### useContext

If you’re familiar with the context API before Hooks, useContext(MyContext) is equivalent to 
- static contextType = MyContext in a class
- to <MyContext.Consumer>.

useContext(MyContext) only lets you read the context and subscribe to its changes. You still need a <MyContext.Provider> above in the tree to provide the value for this context.

---
### useContext, example
Putting it together with Context.Provider

```
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```


---
### Additional Hooks
The following Hooks are either variants of the basic ones

- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue

---
### useReducer
```
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to useState. 

Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method.

If you’re familiar with Redux, you already know how this works

---
### useReducer
useReducer is usually preferable to useState when 
- you have complex state logic that involves multiple sub-values 
- when the next state depends on the previous one

---
### useReducer, example

Here’s the counter example from the useState section, rewritten to use a reducer:
```
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

---
### useReducer, specifying the initial state
There are two different ways to initialize useReducer state. You may choose either one depending on the use case. 

The simplest way is to pass the initial state as a second argument:
```
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

---
### useReducer, lazy initialization
You can also create the initial state lazily. 

You can pass an init function as the third argument. 
- the initial state will be set to init(initialArg).

```
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

---
### useCallback
Returns a memoized callback
```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Pass an inline callback and an array of dependencies. 

useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed

---
### useCallback

Useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders

```
useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).
```

---
### useMemo
Returns a memoized value
```
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Pass a “create” function and an array of dependencies 

useMemo will only recompute the memoized value when one of the dependencies has changed

This optimization helps to avoid expensive calculations on every render

---
### useMemo
The function passed to useMemo runs during rendering

Don’t do anything there that you wouldn’t normally do while rendering 
- side effects belong in useEffect, not useMemo

If no array is provided, a new value will be computed on every render

---
### useRef
useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue)

```
const refContainer = useRef(initialValue);
```

The returned object will persist for the full lifetime of the component

---
### useRef, usecase
A common use case is to access a child imperatively:
```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Essentially, useRef is like a “box” that can hold a mutable value in its .current property


---
### useImperativeHandle
useImperativeHandle customizes the instance value that is exposed to parent components when using ref
```
useImperativeHandle(ref, createHandle, [deps])
```


As always, imperative code using refs should be avoided in most cases

useImperativeHandle should be used with forwardRef:
```
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

In this example, a parent component that renders `FancyInput ref={inputRef} ` would be able to call inputRef.current.focus().

---
### useLayoutEffect
The signature is identical to useEffect
- it fires synchronously after all DOM mutations

Use this to read layout from the DOM and synchronously re-render

Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.

> Prefer the standard useEffect when possible to avoid blocking visual updates


---
### useDebugValue
useDebugValue can be used to display a label for custom hooks in React DevTools
```
useDebugValue(value)
```

For example, consider the useFriendStatus custom Hook 
```
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

