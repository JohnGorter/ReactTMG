# Forms and FormValidation

---
### Forms in React
Two ways of handling forms
- controlled components
    - The preferred and React way
    - Immutable
- uncontrolled components
    - The HTML way


---
### Controlled Components
- Form Component with
    - Value or Checked property
    - value always reflects the value of the property
    - User won't be able to change it

Example 
```js
return (
    <div>Search Term:<input type="search" value="React" /></div>
)
```
* user input has no effect here...

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Controlled component

---
### Controlled Components
- Add state to component to let user change its value

Example 
```js
constructor(){
    super(...arguments);
    this.state = { searchTerm: "React" };
}
handleChange(event) {
    // React handles the merging of oldstate and new property
    this.setState({searchTerm: event.target.value});
}
render(){
    return (
        <div>Search Term:<input type="search" 
            onChange={this.handleChange.bind(this)}
            value={this.state.searchTerm} /></div>
    );
}
```
* user input has effect here...

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Controlled component with State

---
### Advantages of controlled components
- Stays true to React, state is kept out of interface
- Easy input validation and sanatisation
```js
    this.setState({searchTerm: event.target.value.subtr(0, 50)});
```

---
### Special Cases
- TextArea
    - Normally textarea uses inner content
```html
    <textarea>text here</textarea>
```
    - In React
```html
    <textarea value="text here"></textarea>
```

---
### Special Cases
- Select
    - Normally uses the selected attribute
```html
    <select><option selected>a</option></select>
```
    - In React
```html
    <select value="B"><option value="B">Mobile</option></select>
```

---
### Uncontrolled Components
- Often used for larger forms where everything is processed when the user is done
- Any inpuy that does not supply a value property is uncontrolled

example:
```html
    handleSubmit(){
        console.log("Submitted:", event.target.name.value);
        event.preventDefault();
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    Name: <input type="text" name="name" />
                    <button type="submit">Submit</button>
                </div>
            </form>
        );
    }
```

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Forms


                 


