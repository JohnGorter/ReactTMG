# Strict Mode

---
### Strict Mode
StrictMode is a tool for highlighting potential problems in an application
- does not render any visible UI
- activates additional checks and warnings for its descendants

> Strict mode checks are run in development mode only; they do not impact the production build

---
### Strict Mode
You can enable strict mode for any part of your application. For example

```
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

In the above example, strict mode checks will not be run against the Header and Footer components, the rest is checked!

---
### Strict Mode
StrictMode currently inspects
- identifying components with unsafe lifecycles
- warning about legacy string ref API usage
- warning about deprecated findDOMNode usage
- detecting unexpected side effects
- detecting legacy context API

Additional functionality can be added with future releases of React

---
### Identifying unsafe lifecycles
Certain legacy lifecycle methods are unsafe for use in async React applications

With strict mode enabled, React compiles a list of all class components using the unsafe lifecycles, and logs a warning message with information about these components


---
### Warning about legacy string ref API usage
Previously, React provided two ways for managing refs
- the legacy string ref API 
- the callback API

Although the string ref API was the more convenient of the two, it had several downsides and so our official recommendation was to use the callback form instead

React 16.3 added a third option that offers the convenience of a string ref without any of the downsides
```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  render() {
    return <input type="text" ref={this.inputRef} />;
  }
  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

Since object refs were largely added as a replacement for string refs, strict mode now warns about usage of string refs

---
### Warning about deprecated findDOMNode usage
React supported findDOMNode to search for a DOM node given a class instance 
- you don’t need this because you can attach a ref directly to a DOM node

findDOMNode can also be used on class components but this was breaking abstraction levels by allowing a parent to demand that certain children were rendered

findDOMNode does not play well with fragments

You can instead make this explicit by passing a ref to your custom component and pass that along to the DOM using ref forwarding.

You can also add a wrapper DOM node in your component and attach a ref directly to it.

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

---
### Detecting unexpected side effects
Conceptually, React does work in two phases
- render phase determines what changes need to be made 
- commit phase is when changes are applied 
    - in the case of React DOM, this is when React inserts, updates, and removes DOM nodes 
    - lifecycles like componentDidMount and componentDidUpdate execute here

The commit phase is usually very fast, but rendering can be slow
- therefore we have fibers 

---
### Detecting unexpected side effects
Render phase lifecycles include the following class component methods

- constructor
- componentWillMount (or UNSAFE_componentWillMount)
- componentWillReceiveProps (or UNSAFE_componentWillReceiveProps)
- componentWillUpdate (or UNSAFE_componentWillUpdate)
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- setState updater functions (the first argument)

Because the above methods might be called more than once, it’s important that they do not contain side-effects

---
### Detecting unexpected side effects
Strict mode can’t automatically detect side effects for you, but it can help spot them by making them a little more deterministic

- this is done by intentionally double-invoking the following functions
- class component constructor, render, and shouldComponentUpdate methods
- class component static getDerivedStateFromProps method
- function component bodies
- state updater functions (the first argument to setState)
- functions passed to useState, useMemo, or useReducer

> This only applies to development mode. Lifecycles will not be double-invoked in production mode.

---
### Detecting unexpected side effects
For example, consider the following code
```
class TopLevelRoute extends React.Component {
  constructor(props) {
    super(props);

    SharedApplicationState.recordEvent('ExampleComponent');
  }
}
```
If SharedApplicationState.recordEvent is not idempotent
- instantiating this component multiple times could lead to invalid application state

By intentionally double-invoking methods like the component constructor, strict mode makes patterns like this easier to spot

---
### Detecting unexpected side effects

Starting with React 17, React automatically modifies the console methods like console.log() to silence the logs in the second call to lifecycle functions

It may cause undesired behavior in certain cases where a workaround can be used


---
### Detecting legacy context API

The legacy context API is error-prone, and will be removed in a future major version. It still works for all 16.x releases but will show this warning message in strict mode


<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using Strict Mode

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Adding Strict Mode