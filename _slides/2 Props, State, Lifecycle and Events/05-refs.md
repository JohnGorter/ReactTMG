# Refs

---
### References to DOM
In occasions you want to bypass the virtual DOM
- Bad practice
- Just excape hatch for rare occasions

Refs as a string prop on component
```html
<input ref="myInput" />
```

Access like
```js
let input = this.refs.myInput;
console.log(input.getClientBoundingRect();)
```

---
### Usecase for Refs
Suppose we want to set the focus on an input after button click
```js
class FocusText extends Component {
    handleClick(){
        this.refs.myText.focus();
    }
    render(){
        return (
            <div>
                <input type="text" ref="myText"/>
                <input type="button" onClick={this.handleClick.bind(his)} />
            </div>
        );
    }
}
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Build some components yourself