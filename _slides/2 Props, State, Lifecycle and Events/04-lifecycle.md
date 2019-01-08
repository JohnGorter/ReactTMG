# Component Lifecycle

---

### Component LifeCycle
- React components have a lifecycle.
- Each lifecycle phase provides hook methods.
- Automatically called by React

---

### Lifecycle Phases and Methods
In the life of a component, these are its phases
- Mounting (attaching to DOM)
- Unmounting (releasing from DOM)
- Props Changes
- State Changes

In each of these phases, methods on your component are called

---

### Mounting

Method/Callback | Description
--- | ---
(Class Constructor) | 
componentWillMount | Invoked once before initial rendering (setting state does not trigger re-render)
(render) | 
componentDidMount | Invoked once after initial rendering

---

### UnMounting

Method/Callback | Description
--- | ---
componentWillUnmount | Invoked immediately before a component id unmounted from the DOM (clean up)

---

### Props Changes

Method/Callback | Description
--- | ---
componentWillReceiveProps | Invoked when a component is receiving new props
shouldComponentUpdate | Special function called before render to optionally skip rendering
componentWillUpdate | Invoked immediately before rendering
(render) | 
componentDidUpdate | Invoked immediately after rendering

---

### State Changes (almost same as Props Changes)

Method/Callback | Description
--- | ---
shouldComponentUpdate | Special function called before render to optionally skip rendering
componentWillUpdate | Invoked immediately before rendering
(render) | 
componentDidUpdate | Invoked immediately after rendering

* no componentWillReceiveProps because
* An incoming prop transition may cause state change, not the other way around

---
### Summary

The most important ones are:
1. When a component is rendered to the DOM, `componentDidMount()` will run.
1. When a component is removed from the DOM, `componentWillUnmount()` will run.

<!-- .element: class="fragment" -->&rarr; Can you think of a use case for both of them?

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Lifecycle Events demo

---

### `componentDidMount` vs. constructor

* Constructor can/should
  * initialise state to _sane_ defaults
  * bring component in a state that can be rendered
  * *not* have side effects
* `componentDidMount` can/should
  * update state with new data (e.g. fetched / loaded)
  * keep component in a state that can be rendered

><!-- .element: class="fragment" -->Forgetting `this.state = { ... }` in the constructor can easily lead to errors inside `render()`.

