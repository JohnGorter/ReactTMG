# Events

---
### Events
HTML has API for event handling using attributes
```html
  <div onclick="javascript:..."></div>
```
Downsides:
- pollutes the global namespace
- hard to track in big HTML file
- can be slow and lead to memory leaks

---
### JSX Event Listeners
Support for similar API
Benefits:
- Callback functions scoped to component
- Auto unmounting
- Event Delegation
Difference:
- properties are camel-cased
  - onClick instead of onclick

---
### Recap

* Mutating state is often a reply to some (user) event.
* Mouse clicked, key pressed, input changed, form submitted
* Basic principle is just like DOM or jQuery events, except

|      |Event naming|Event handling               |
|------|------------|-----------------------------|
|DOM   |lowercase   |pass function _name_         |
|jQuery|lowercase   |pass function (often inline) |
|React |camelCase   |pass function (by reference) |

```js
<button onClick={ someFunction }>
    Click me
</button>
```

---
### Synthetic event

* Event handling functions will receive an `event` parameter.
* This is not the browser's native event!
* It's called a _synthetic event_ and it wraps the browser’s native event.
* Same interface, and works identically across all browsers.

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
`this` is not what you think it is

---

### How to prevent `this`?

1. Manually bind the callback to the instance of the class in the constructor:
`this.handleClick = this.handleClick.bind(this);`
1. Use public class fields syntax as callbacks (experimental stuff 🤷):
`handleClick = () => { ... }`
1. Use arrow functions as callback. Please don't do this!       
`onClick={ (e) => this.handleClick(e) }`           
&rarr; Why not?

---

### No bind or arrow functions in in JSX Props

```js
(e) => this.handleClick(e)   // Arrow function
this.handleClick.bind(this)  // Bind
```
* Both will create a new function *every time* you call it.
* <!-- .element: class="fragment" -->Remember: as you change the props passed to a component, that component will re-render.
* <!-- .element: class="fragment" -->Imagine rendering a (large) list of items, each of them declaring their own `onClick` callback this way.
  * <!-- .element: class="fragment" -->Each item in the list is fully re-rendered!

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
`<Checkbox />` in action

