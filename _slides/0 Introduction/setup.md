# Setup

---
### Getting started

What you need:
* NodeJS and NPM/NPX
* Babel
* React
* React DOM

What you need to know:
* HTML
* JavaScript/ES6

---
### How to include React and Babel
You can load them on the fly from a CDN (great for prototyping, bad for performance).

Or...

Use Grunt, Gulp or Webpack to create a development workflow with hot-reloading, unit testing and minification.

Hint: this has been done by others, too!

---
### Defining React

One definition could be
> React is an engine for building composable user interfaces using JavaScript and (optionally) XML

Although the site calls React a library, it basically acts as a game view engine.

---
### Benefits of React
- Simple
    - React rerenders when state changes automagically
- Scalable
    - React lets you write self contained, composable components
- Pure JavaScript
    - Components are written in plain JavaScript instead of using templates like others
- Abstraction
    - React abstracts the view, making it possible to render to other platforms (IOS/Android/VR)

---
### Hello React
At the bare minimum, this could be a React App
```JS
class Hello extends React.Component {
    render(){
        return (
            <h1>hello world</h1>
        )
    }
}
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Hello React

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Hello React



