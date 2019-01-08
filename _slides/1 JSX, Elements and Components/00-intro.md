# JSX, Elements & Components

---
## What is JSX?

    const something = <div className="greeting">Hello world!</div>;

* A syntax extension to JavaScript
  * not XML, not XML, not a string of characters
  * allows embedded expressions
  * supports attributes
* Can be nested
* Automatic XSS prevention
* Needs to be _transpiled_ to JavaScript
  * e.g. `React.createElement(...)`


---
### JSX vs HTML
Three important differences
- Tag attributes are camel cased
```html
    <input type="text" maxLength="10" />
```
- All elements must be balanced
    - instead of <br> use <br/>
- Attribute names are based on DOM API, not HTML language specs
not 
```
    <div id="box" class="class"></div>
```
but
```
    <div id="box" className="class"></div>
```

---
### JSX Quirks
JSX can be tricky
- Single root node
```
    return ( <h1>Hello world</h1> )
    // translates to 
    // return React.createElement("h1", null, "Hello world");
```
```
    return ( <h1>Hello world</h1><p>test</p> )
    // translates to 
    // return React.createElement("h1", null, "Hello world") React.createElement("p", null, "test");
    // which does not compile 
```

* Wrap your elements in a containing element for return

---
### JSX Quirks
- Conditional clauses

```
      <h1 className={if (true) { "title"}}>Hello React</h1>
      // translates to 
      // return React.createElement("h1", {className: if (true) { "title"}}, "Hello React})
      // which obviously does not compile

```
```
      <h1 className={condition ? "title" : ""}>Hello React</h1>
      // translates to 
      // return React.createElement("h1", {className: true ? "title" : ""}}, "Hello React})
      // which does compile

``` 

---
### JSX Quirks
- Conditional clauses (2)
```
      // move the condition out
      let classnName;
      if (true) { className="title"}
      <h1 className={className}>Hello React</h1>
```
* Use ternary operator
* move the condition out
* undefined are automatically handled, no class attribute gets generated

---
### JSX Quirks
- Blank spaces 


```
      // Newlines are not black spaces
      <h1>Hello</h1>
      <h1>React</h1>
      // becomes <h1>Hello</h1><h1>React</h1>
```
```
      // use expression
      <h1>Hello</h1>{" "}
      <h1>React</h1>
      // becomes <h1>Hello</h1> <h1>React</h1>
``` 

---
### JSX Quirks
- Comments
```
     let content = (
         <Nav>
         { /* child comment, put {} around */ }
         <Person
            /*  multi 
                line 
                comment */
            name={window.isLoggedIn ? window.name : ''} // end of line comment
        />
        </Nav>
     );
```
* Can't use HTML comment <!-- -->

---
### Render Dynamic HTML
React has built-in XSS attack protection
    - won't allow dynamic HTML tags

```
  // content = "<h1>Hello World</h1>";
  render(){
        let content = "<h2>Hello world</h2>";
        return (
            <h1>{content}></h1>  // => renders literally
            <h1 dangerouslySetInnerHTML={{__html:content}}></h1> // => renders HMTL
        )
    }
```

---
### What is an element?

    const element = <div className="greeting">Hello world!</div>;
    ReactDOM.render(element, document.getElementById('root'));

* "just" a JavaScript object
  * immutable
  * representing a DOM node
* React will create / update the DOM based on those objects
* Lets you focus on _what_ you want to see, not on _how_ to achieve it


---
## What is a component?

    const Greeter1 = () => <div className="greeting">Hello, world!</div>;
    
    class Greeter2 extends React.Component {
        render() {
            return <div className="greeting">Hello, world!</div>;
        }
    }

* A JavaScript function *or* classs
* Implements an independent, reusable piece of user interface
* Return JSX _elements_, which will turn into React elements

---
### Dynamic Values
- Values written in {} are JavaScript expressions

```
import React, {Component} from 'react';
class Greeter3 extends Component {
    render(){
        var place = "World";
        render() {
            return <div className="greeting">Hello, {place}!</div>;
        }
    }
}
```

---
### Composing Components
You can make use of
- Parent and Child components 
- Pass data using properties
    - Configuration properties for passing data from parent to child
    - Immutable, passed and owned by parent component
    - Provided as attributes in JSX

* Convention: component name starts with an uppercase letter
* more on Props later

---
### Example

```
class GroceryList extends Component {
    render(){
        return (
            <ul>
                <ListItem quantity="1" name="Bread" />
            </ul>
        );
    }
}
class ListItem extends Component {
    render(){
        return (
            <li> {this.props.quantity}x {this.props.name} </li>
        );
    }
}
```

---
### Alternative Example

```
class GroceryList extends Component {
    render(){
        return (
            <ul>
                <ListItem quantity="1">"Bread" </ListItem>
            </ul>
        );
    }
}
class ListItem extends Component {
    render(){
        return (
            <li> {this.props.quantity}x {this.props.children} </li>
        );
    }
}
```

---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
JSX, Elements & Components

---

<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Introducing the Kanban App