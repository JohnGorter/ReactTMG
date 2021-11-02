
# React Developer Tools

---
### React Developer Tools

the React Developer Tools are an essential instrument you can use to inspect a React application

---
### Setup

RDT is Available for both Chrome and Firefox, download throug extensions.

They provide an inspector that reveals the React components tree that builds your page
For each component you can 
- check the props, 
- the state
- hooks
- lots more

---
### Use
After installation, open the regular browser devtools
- you will find 2 new panels 
    - Components 
    - Profiler

--- 
### Components

Move the mouse over the components
- the browser will select the parts that are rendered by that component

If you select any component in the tree
- the right panel will show you a reference to the parent component and the props passed to it

You can easily navigate by clicking around the component names

--- 
### Components

You can 
- click the eye icon to inspect the DOM element
- click the mouse icon so you can hover an element in the browser  to directly select the React component that renders it
- use the bug icon to log a component data to the console.


Once you have the data printed there, you can right-click any element and press “Store as a global variable”

Then, to inspect it in the console, use the temporary variable assigned to it, named `temp1`

---
### Profiler 
Allows us to record an interaction in the app


<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Show the dev tools

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Excercise: https://react-devtools-tutorial.vercel.app/