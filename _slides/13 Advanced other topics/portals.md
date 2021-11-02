# Portals

Sometimes it’s useful to insert a child into a different location in the DOM

---
### Portals
Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component

```
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

The first argument (child) is any renderable React child, such as an element, string, or fragment. The second argument (container) is a DOM element.


---
### Portal use cases
A typical use case 
- when a parent component has an overflow: hidden or z-index style, but you need the child to visually “break out” of its container
    - dialogs 
    - hovercards
    - tooltips


---
### Event Bubbling Through Portals
Even though a portal can be anywhere in the DOM tree, it behaves like a normal React child in every other way
- context work exactly the same regardless of whether the child is a portal, as the portal still exists in the React tree regardless of position in the DOM tree.
- event bubbling. An event fired from inside a portal will propagate to ancestors in the containing React tree, even if those elements are not ancestors in the DOM tree

---
### Event Bubbling Through Portals
Assuming the following HTML structure:
```
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

A Parent component in #app-root would be able to catch an uncaught, bubbling event from the sibling node #modal-root

---
### Event Bubbling Through Portals
```
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

---
### Event Bubbling Through Portals

Catching an event bubbling up from a portal in a parent component allows the development of more flexible abstractions that are not inherently reliant on portals

- for example, if you render a <Modal /> component, the parent can capture its events regardless of whether it’s implemented using portals


<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using Portals

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using Portals