# Profiler 

---
### Profiler

> The Profiler measures how often a React application renders and what the “cost” of rendering is

Its purpose is to help identify parts of an application that are slow and may benefit from optimizations such as memoization.

---
### Profiler
Profiling adds some additional overhead, so it is disabled in the production build

---
### Profiler, Usage
A Profiler can be added anywhere in a React tree to measure the cost of rendering

It requires two props
- an id (string) 
- an onRender callback (function) which React calls any time a component within the tree “commits” an update

---
### Profiler, Example
For example, to profile a Navigation component and its descendants
```
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

---
### Profiler, Example
Multiple Profiler components can be used
```
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```
---
### Profiler, Example
Profiler components can also be nested 
```
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

---
### onRender Callback
The Profiler requires an onRender function as a prop

React calls this function any time a component within the profiled tree “commits” an update - it receives parameters describing what was rendered and how long it took

---
### onRender Callback
```
function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```


<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using the Profiler

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Adding Profiling