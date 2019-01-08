# Architecting Applications

---
### Architecting Applications
- Applications exist of a composition of components
- Components need to be consistent and documented
    - Prop Validation

---
### Prop Validation
- PropTypes
    - Documents type and required properties for components
    - React throws descriptive errors when requirements are not met
    
```js
class Greeter extends Component {
    render() {
        return (
            <h1>{this.props.greeting}</h1>
        )
    }
}
Greeter.propTypes = {
    greeting: PropTypes.string.isRequired
}
```

* If the requirements are not respected, console.warn is logged
* Optional props leave off the isRequired property

---
### Default Prop Values
To provide default values
```js
...
Greeter.propTypes = {
    greeting: PropTypes.string.isRequired
}

Greeter.defaultProps = {
    greeting: "Hello World"
}
```



---
### PropType Validation
React contains a lot of validators for types

Validator|Description
--- | --- 
PropTypes.array | Props must be an array
PropTypes.bool | Props must be a Boolean value
PropTypes.func | Props must be a function
PropTypes.number | Props must be a number
PropTypes.object | Props must be an object
PropTypes.string | Props must be a string
PropTypes.oneOfType | Props could be one of many types

---
### PropType Validation

Validator|Description
--- | --- 
PropTypes.arrayOf | Props must be an array of certain type
PropTypes.objectOf | Props must be an object with property values of certain type
PropTypes.shape | Props must conform to certain shape
PropTypes.node | Props can be any value that can be rendered
PropTypes.element | Props must be a React element
PropTypes.instanceOf | Props must be an instance of a given class
PropTypes.oneOf | Props must be specific value (enum)

---
### Examples of PropType Validation

```js
// a multi shaped property
PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

// an array property with typed members
PropTypes.arrayOf(PropTypes.number);

// a shape object property type
PropTypes.shape({color:PropTypes.string, fontSize:PropTypes.number});

// a object type validator
PropTypes.instanceOf(Message);

// an enum validator
PropTypes.oneOf(['News', 'Photos']);
```

---
### Custom PropType Validators

You can create your own

```js
let titlePropType = (props, propName, componentName) => {
    if (props[propName]) {
        let value = props[propName];
        if (typeof value !== 'string' || value.length > 80) {
            return new Error(`${propName} in ${componentName} is too long!`);
        }
    }
}

Greeter.propTypes = {
    title: titlePropType,
    ...
}
```


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
PropTypes