# Styling Components

---

### Inline styles
Components are styled inline as javaScript object
 - Camel cased names
 - No need to specify pixels

Example
```js
render(){
    let style = {
        width:100,
        backgroundColor:'red',
        color:this.props.color
    };
    return <div style={style} color="green">Hello World</div>
}
```

---

### Inline styles

Styles can be exposed as properties

```js
render() {
   return <MyDiv color="green">Hello World</MyDiv>
}

class MyDiv extends Component {
    render(){
        let style = {
            width:100,
            backgroundColor:'red',
            color:this.props.color
        };
        return <div style={style}>Content Here</div>
    }
}

```



---

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Styling Components

---

<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Style your Component