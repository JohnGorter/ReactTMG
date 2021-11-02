# Forwarding Refs

--- 
### Forwarding Refs
Ref forwarding is a technique for automatically passing a ref through a component to one of its children

This is typically not necessary for most components in the application

---
### Forwarding refs to DOM components
Consider a FancyButton component that renders the native button DOM element:
```
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```
Some components tend to be used throughout the application in a similar manner as a regular DOM button and input
- accessing DOM nodes may be unavoidable for managing focus, selection, or animations

---
### Forwarding refs to DOM components
Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child

Example uses React.forwardRef to obtain the ref passed to it, and then forward it to the DOM button that it renders
```
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

---
### Forwarding refs to DOM components

step-by-step this happens:

- we create a React ref by calling React.createRef 
- assign it to a ref variable
- pass our ref down to FancyButton ref={ref} by specifying it as a JSX attribute
- React passes the ref to the (props, ref) => ... function inside forwardRef as a second argument
- we forward this ref argument down to button ref={ref} by specifying it as a JSX attribute
- when the ref is attached, ref.current will point to the button DOM node.

---
### Forwarding refs to DOM components
Ref forwarding is not limited to DOM components

You can forward refs to class component instances

---
### Forwarding refs in higher-order components
This technique can also be particularly useful with higher-order components (also known as HOCs). Let’s start with an example HOC that logs component props to the console:

```
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```

The “logProps” HOC passes all props through to the component it wraps, so the rendered output will be the same

---
### Forwarding refs in higher-order components
For example, we can use this HOC to log all props that get passed to our “fancy button” component:
```
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Rather than exporting FancyButton, we export LogProps.
// It will render a FancyButton though.
export default logProps(FancyButton);
```

There is one caveat to the above example: refs will not get passed through

---
### Forwarding refs in higher-order components
If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

This means that refs intended for our FancyButton component will actually be attached to the LogProps component
```
import FancyButton from './FancyButton';

const ref = React.createRef();

// The FancyButton component we imported is the LogProps HOC.
// Even though the rendered output will be the same,
// Our ref will point to LogProps instead of the inner FancyButton component!
// This means we can't call e.g. ref.current.focus()
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
```

Fortunately, we can explicitly forward refs to the inner FancyButton component using the React.forwardRef API

---
### Forwarding refs in higher-order components
React.forwardRef accepts a render function that receives props and ref parameters and returns a React node. For example:
```
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

---
### Displaying a custom name in DevTools
React.forwardRef accepts a render function

React DevTools uses this function to determine what to display for the ref forwarding component

For example, the following component will appear as ”ForwardRef” in the DevTools
```
const WrappedComponent = React.forwardRef((props, ref) => {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

If you name the render function, DevTools will also include its name (e.g. ”ForwardRef(myFunction)”)

```
const WrappedComponent = React.forwardRef(
  function myFunction(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }
);
```

---
### Displaying a custom name in DevTools
You can even set the function’s displayName property to include the component you’re wrapping:
```
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // Give this component a more helpful display name in DevTools.
  // e.g. "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
```

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using forward refs

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using forward refs