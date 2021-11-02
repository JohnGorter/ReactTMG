# Higher-Order Components

---
### Higher-Order Components
A higher-order component (HOC) is an advanced technique in React for reusing component logic

> They are a pattern that emerges from React’s compositional nature


---
### Higher-Order Components
Concretely, a higher-order component is a function that takes a component and returns a new component

```
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Whereas a component transforms props into UI, a higher-order component transforms a component into another component

HOCs are common in third-party React libraries, such as Redux’s connect and Relay’s createFragmentContainer

---
### Use HOCs For Cross-Cutting Concerns
HOCs allow to reuse logic (like mixins)

Example:

Suppose we have this CommentList

```
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

---
### Use HOCs For Cross-Cutting Concerns

Later we implement a very similar BlogPost:
```
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

---
### Use HOCs For Cross-Cutting Concerns
CommentList and BlogPost aren’t identical 
- they call different methods on DataSource
- they render different output 

Much of their implementation is the same:
- on mount, add a change listener to DataSource
- inside the listener, call setState whenever the data source changes
- on unmount, remove the change listener

You can imagine that in a large app, this same pattern of subscribing to DataSource and calling setState will occur over and over again

---
### Use HOCs For Cross-Cutting Concerns
We want an abstraction that allows us to define this logic in a single place and share it across many components

HOCS are suitfull here

---
### Use HOCs For Cross-Cutting Concerns
We can write a function that creates components, like CommentList and BlogPost, that subscribe to DataSource
- it will accept as one of its arguments a child component that receives the subscribed data as a prop

Let’s call the function withSubscription:
```
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

---
### Use HOCs For Cross-Cutting Concerns
The first parameter is the wrapped component

The second parameter retrieves the data we’re interested in, given a DataSource and the current props

When CommentListWithSubscription and BlogPostWithSubscription are rendered, CommentList and BlogPost will be passed a data prop with the most current data retrieved from DataSource:

```
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

---
### HOC important characteristics
Important:
- a HOC doesn’t modify the input component
- does not use inheritance to copy its behavior

a HOC 
- composes the original component by wrapping it in a container component
- is a pure function with zero side-effects


---
### HOC important characteristics
Like components, the contract between withSubscription and the wrapped component is entirely props-based

-  this makes it easy to swap one HOC for a different one
    - as long as they provide the same props to the wrapped component
    

---
### Don’t Mutate the Original Component

Use Composition. dont modify the components prototype!

```
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}


// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

---
### Don’t Mutate the Original Component
There are a few problems with this
- the input component cannot be reused separately from the enhanced component
- if you apply another HOC to EnhancedComponent that also mutates componentDidUpdate, the first HOC’s functionality will be overridden! 
- this HOC also won’t work with function components, which do not have lifecycle methods

Mutating HOCs are a leaky abstraction—the consumer must know how they are implemented in order to avoid conflicts with other HOCs

---
### Don’t Mutate the Original Component
Instead of mutation, HOCs should use composition, by wrapping the input component in a container component:

```
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

This HOC has the same functionality as the mutating version while avoiding the potential for clashes
- it works equally well with class and function components
- it’s composable with other HOCs, or even with itself

---
### HOCS vs container components

Container components are part of a strategy of separating responsibility between high-level and low-level concerns. Containers manage things like subscriptions and state, and pass props to components that handle things like rendering UI

HOCs use containers as part of their implementation

You can think of HOCs as parameterized container component definitions

---
### Conventions
HOC follow certain conventions:
- Pass Unrelated Props Through to the Wrapped Component
- Maximizing Composability
- Wrap the Display Name for Easy Debugging

---
### Convention: Pass Unrelated Props Through to the Wrapped Component
- HOCs add features to a component. They shouldn’t drastically alter its contract. It’s expected that the component returned from a HOC has a similar interface to the wrapped component
- HOCs should pass through props that are unrelated to its specific concern. Most HOCs contain a render method that looks something like this:

```
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

This convention helps ensure that HOCs are as flexible and reusable as possible

---
### Convention: Maximizing Composability
Not all HOCs look the same. Sometimes they accept only a single argument, the wrapped component
```
const NavbarWithRouter = withRouter(Navbar);
```
Usually, HOCs accept additional arguments. In this example from Relay, a config object is used to specify a component’s data dependencies:
```
const CommentWithRelay = Relay.createContainer(Comment, config);
```
The most common signature for HOCs looks like this:

```
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```
What?! If you break it apart, it’s easier to see what’s going on.
```
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

In other words, connect is a higher-order function that returns a higher-order component!

---
### Convention: Maximizing Composability
This form may seem confusing or unnecessary, but it has a useful property

Single-argument HOCs like the one returned by the connect function have the signature Component => Component 

Functions whose output type is the same as its input type are really easy to compose together

```
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

This same property also allows connect and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal

The compose utility function is provided by many third-party libraries including lodash (as lodash.flowRight), Redux, and Ramda.

---
### Convention: Wrap the Display Name for Easy Debugging
The container components created by HOCs show up in the React Developer Tools like any other component. 

To ease debugging, choose a display name that communicates that it’s the result of a HOC.

```
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

---
### Caveats
Higher-order components come with a few caveats that aren’t immediately obvious if you’re new to React.
- don’t Use HOCs Inside the render Method
- Static Methods Must Be Copied Over
- Refs Aren’t Passed Through

---
### Caveat: don’t Use HOCs Inside the render Method
React’s diffing algorithm (called Reconciliation) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one
```
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

The problem here isn’t just about performance — remounting a component causes the state of that component and all of its children to be lost!

---
### Solution: don’t Use HOCs Inside the render Method
Apply HOCs outside the component definition so that the resulting component is created only once. 

Its identity will be consistent across renders. This is usually what you want, anyway

In those rare cases where you need to apply a HOC dynamically, you can also do it inside a component’s lifecycle methods or its constructor!

---
### Caveat: Static Methods Must Be Copied Over
Sometimes it’s useful to define a static method on a React component. For example, Relay containers expose a static method getFragment to facilitate the composition of GraphQL fragments

When you apply a HOC to a component, though, the original component is wrapped with a container component
- the new component does not have any of the static methods of the original component

```
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

---
### Solution: Static Methods Must Be Copied Over
To solve this, you could copy the methods onto the container before returning it:

```
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```
However, this requires you to know exactly which methods need to be copied. You can use hoist-non-react-statics to automatically copy all non-React static methods

```
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

---
### Solution: Static Methods Must Be Copied Over
Another possible solution is to export the static method separately from the component itself.
```
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

---
### Caveat: Refs Aren’t Passed Through
While the convention for higher-order components is to pass through all props to the wrapped component, this does not work for refs
 
- ref is not really a prop, it’s handled specially by React
- if you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component

---
### Solution: Refs Aren’t Passed Through
Use the React.forwardRef API 

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using React.forwardRef

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using React.forwardRef