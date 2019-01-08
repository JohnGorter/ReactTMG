# React without JSX

---

### Plain Javascript
You can create components using plain JavaScript
```js
let child = React.createElement("li", null, 'content');
ReactDOM.render(child, document.getElementById("root"));
```

---

### Factories
React provides short-hands
```js
return (
    React.DOM.form({className:"commentForm"},
        React.DOM.input({type:"text", placeholder:"Name"}),
        React.DOM.input({type:"text", placeholder:"Comment"}),
        React.DOM.input({type:"submit", value:"Post"})
));
```
equals JSX
```
  <form className="commentForm">
    <input type="text" placeholder="Name" />
    <input type="text" placeholder="Comment" />
    <input type="submit" value="Post" />
  </form>
```

---

### Factories destructured
Tip
```js
let { form, input } = React.DOM;
return (
    form({className:"commentForm"},
        input({type:"text", placeholder:"Name"}),
        input({type:"text", placeholder:"Comment"}),
        input({type:"submit", value:"Post"})
));
```

---
### Custom Factories
You can create factories 
```
let Factory = React.createFactory(ComponentClass);
...
let root = Factory({ custom:'prop'});
render(root, document.getElementById("root"));
```


---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using plain JavaScript

---

<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Create a component using plain JavaScript
