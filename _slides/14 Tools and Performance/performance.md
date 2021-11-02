# Performance and Tooling

---
### Performance and Tooling
React tries to perform at best by
- minimizing the DOM operations

* You need to know how the reconciliation process works

React provides tools to
- inspect and finetune your application

* You need to know your application's bottlenecks

---
### Reconciliation process
Reconciliation process happens when state causes a component to re-render
When setState is called
- component is marked as 'dirty'
- changes do not effect immediately
- changes are batched and effected in next loop cycle
- DOM therefore only updated once per event loop cycle

---
### Subtree Rendering
Components marked 'dirty' cause subtree re-rendering
- All children of the 'dirty' component are re-rendered

* Sounds inefficient but actually fast because React renders a in memory virtual DOM

You can prevent a child from re-rendering when necessary
- shouldComponentUpdate is called before re-rendering
- gives you an option to performance tune rendering
- occasionally needed

* Prevent premature optimisation with 'shouldComponentUpdate' because
    - code gets more complicated
    - it can lead to hard to track bugs


---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Create a performance bottleneck

---
### Tooling
There is tooling to inspect your app
- Performance measuring in Chrome DevTools
    - Performance API
    - Performance Tab, query param: react_perf
- React Devtools
    - Extension for Chrome

... much much more...

---
### Performance API
Chrome adds performance API for user timings
example
```js
performance.mark("start") // 100ms
/* some executions here */
window.setTimeout(() => {
    performance.mark("end") // 500ms
    performance.measure("difference", "start", "end");
}, 1000);
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using the performance api

---
### Performance measuring
React has built in performance api calls
How to visualize React timings
- open the link to your app using http://localhost:3000?react_perf
- open the Chrome DevTools Performance tab and press Record
- perform the actions that you want to analyze
- stop recording
- inspect the visualization under User Timing

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using the react_perf

---
### React Devtools
- Chrome extension for React Components which
- lets you inspect the component tree
- call methods on the selected components
    - $r.setState(field:newval)
- record and inspect performance 

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using the React DevTools

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Performance and Tools

