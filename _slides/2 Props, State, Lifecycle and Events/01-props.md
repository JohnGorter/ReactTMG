# Props, State, Lifecycle & Events

---
## Recap

A component is either

<!-- .element: class="fragment" -->&rarr; a **function** that returns element(s)

_or_

<!-- .element: class="fragment" -->&rarr; a **class** whose `render` method returns element(s).

<!-- .element: class="fragment" -->Both accept _one_ parameter, commonly called `props`.

---
### Props

* Think of them as an object with arbitrary inputs for a component.
* Method argument for function components


```js
const Greeter = (props) => <div>Hello, { props.name }!</div>;
```

* Instance variable for class components

```js
class Greeter extends React.Component {
    render() {
        return <div className="greeting">Hello, { this.props.name }!</div>;
    }
}
```

* When using the component, they look like XML attributes


```js
const App1 = () => <Greeter name={ world } />;
const App2 = () => <Greeter name='world' />;
```

<!-- .element: class="fragment" -->&rarr; What's the difference between `App1` and `App2`?

---

### Typing & structure

* JavaScript is in itself weakly typed
* So how do we know what the `props` will contain?
* _Object destructuring_ can help you:

```js
const Greeter = ({ name }) => <div>Hello, { name }!</div>;
```

* Note how `props.name` turns into `name`.

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Building components that accept `props`

---

### Re-rendering

As soon as you change the props passed to a component, that component will re-render.
1. Invoking the component function.
1. Invoking the class' `render()` method.

This is called one-way databinding.