# ReactNative

---
### Context
- Basic Animation 
    - using CSS
- React Animation
    - Using React Transition Group

- Website
    https://facebook.github.io/react-native

---
### Basic Animation
Two Categories
- CSS Transitions (only have a start and end state)
    - controlled using transition css property
    ```js
    div { transition:color 2s ease-in-out 100}
    ```
- CSS Keyframes (more complex transitions possible)
    - controlled using @keyframes rule
    ```js
    @keyframes pulse {
        0% {transform:none;}
        50% {transform:scale(1.4);}
        100% {transform:none;}
    }
    ```

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
CSS Animations


---

### Programmatically starting Animations
Use class wrappers and set classes programmatically
```js
<style>
    .sidebar { position:absolute; background-color:#eee;width:15rem;}
    .sidebar-transition { opacity:0; left:-15rem;}
    .sidebar-transition-active {opacity:1; left:0; transition: ease-in-out 0.5s;}
</style>
<div class="sidebar sidebar-transition"><ul><li></li</ul></div>

...
<button onclick="javascript:document.querySelector('.sidebar').classList.add('sidebar-transition-active');">&#9776;</button>))>
```

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
CSS Animations Programmatically

---
### React Transition Group
React Components for animation
Setup using
- npm or yarn
```js
    # npm
    npm install react-transition-group --save

    # yarn
    yarn add react-transition-group
```
- CDN / External
    - https://unpkg.com/react-transition-group/dist/react-transition-group.min.js

It consists of the following components
- Transition
- CSSTransition
- TransitionGroup

---
### Transition
The Transition component lets you describe a transition from one component state to another over time with a simple declarative API.
- It only tracks "enter" and "exit" states for the components. It's up to you to give meaning and effect to those states.

Example
```js
import Transition from 'react-transition-group/Transition';

const defaultStyle = {transition: `opacity 300ms ease-in-out`, opacity: 0} ;
const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1 },
};

const Fade = ({ in: inProp }) => (
  <Transition in={inProp} timeout="300">
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        I'm a fade Transition!
      </div>
    )}
  </Transition>
);
```

---
### Transition
There are 4 main states a Transition can be in
- entering
- entered
- exiting
- exited

Transition state is toggled via the in prop

* When true the component begins the "Enter" stage.

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Transition Component

---
### CSS Transtion
- simpeler version for CSS transitions
- applies a pair of class names during the appear, enter, and exit stages 
- the first class is applied and then a second "active" class in order to activate animation. 
- afterwards, matching done class names are applied to persist animation state.

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
CSSTransition Component


---
### TransitionGroup
Component that manages a set of <Transition> components in a list
- a state machine for managing the mounting and unmounting of components over time
- wraps Transition wrapped components and manages them upon insertion or removal
- childs must have a key property

```js
...
 <TransitionGroup className="todo-list">
    {items.map(({ id, text }) => (
        <CSSTransition key={id} timeout={500} classNames="fade">
        <ListGroupItem>
            <Button className="remove-btn" type="button" bsStyle="danger" bsSize="xs" onClick={() => {
                this.setState(state => ({
                items: state.items.filter(item => item.id !== id),
                }));
            }}
            >&times;</Button>
            {text}
        </ListGroupItem>
        </CSSTransition>
    ))}
</TransitionGroup>
...
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Animation time