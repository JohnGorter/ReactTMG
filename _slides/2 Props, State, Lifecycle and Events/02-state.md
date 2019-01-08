# Statefull Components

---
### State
- Mutable object that holds state for the component
- Initialised in constructor
- Needs to be set using 'setState' function
- 'setState' triggers rerender of the component

```
class Greeter4 extends Component {
    constructor(){
        super(...arguments);
        this.state = { toggle: false}
    }
    render(){
        let details;
        if (this.state.toggle) {  details = <div>More Info </div> }
        return ( 
            <div>
                <div>{details}</div> 
                <div onClick={() =>this.setState({toggle:!this.state.toggle})}>hit me</div>
            </div>
        );
    }

```

---
### More State

* Components may need to keep state that is private.
* A _pure_ function component can never keep state, because _pure_ functions
    * do not attempt to change their inputs.
    * always return the same result for the same inputs.
* Keeping state means you need a class!


---
### Something odd?

```js
class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    render() {
        return <input checked={ this.state.checked } />;
    }
}
```

<!-- .element: class="fragment" -->&rarr; In this class, `state` is a constant value. 

---

### Three rules for mutating state

1. _Never_ modify state directly!
    * Bad: `this.state.checked = true` does not work
    * **Good**: instead, use `setState({ checked: true });`.
1. <!-- .element: class="fragment" -->Mutating state is _async_
    * Don't expect state to be updated immediately after invoking `setState()`.
1. <!-- .element: class="fragment" -->State is _merged_:
    * No need to copy previous state when invoking `setState()`.

---

### Checking the checkbox

```js
class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    render() {
        return <input checked={ this.state.checked } />;
    }
}
```

* How to toggle the internal state of the checkbox?


```js
toggle() {
    this.setState({ checked: !this.state.checked });
}
```
<!-- .element: class="fragment" -->

---

### Toggle, toggle, toggle

```js
toggle() {
    this.setState({ checked: !this.state.checked });
}
```
This snippet contains a subtle bug.
Can you spot it?

---

### Toggle, toggle, toggle

```js
toggle() {
    this.setState({ checked: !this.state.checked });
}
```
Since `setState` is async, we should not rely on the value of `this.state` that we observe when we invoke `setState`.
Instead, we should pass a `mutator`, a function that will be invoked when the actual mutation takes place.

```js
toggle() {
    this.setState((prevState, props) => ({
        checked: !prevState.checked
    }));
}

```
<!-- .element: class="fragment" -->
