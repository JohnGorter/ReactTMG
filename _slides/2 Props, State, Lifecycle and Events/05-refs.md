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
console.log(input.getBoudingClientRect();)
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
                <input type="button" onClick={this.handleClick.bind(this)} />
            </div>
        );
    }
}
```
> But this is deprecated because of security issues..

---
### Not deprecated way

```
class MyComponent extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.john.changeTitle("I am changing you");
    }

    render() {
        return (<div>
            <john-element ref={el => this.john = el}></john-element>
            <button onClick={this.handleClick}>Change the title</button>
        </div>)
    }
}
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Build some components yourself