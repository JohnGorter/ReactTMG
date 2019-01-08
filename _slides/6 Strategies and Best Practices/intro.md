# Strategies and Best Practices

---
### Statefull and Pure Components
Components can have data as props and state
- Props are component's configuration
- State contains mutable data for instance
    - is optional

Components without state are called pure components

Statefull components are usually higher on the component hierarchy

---
### Benefits of pure components
- Easier to understand
- Easier to test
- Easier to reuse

---
### Which Components are Statefull
Follow this checklist
- Identify every component that renders based on that state
- Find a common owner component, this should contain all state
- If there is no common owner component, create one

---
### Example Quiz
- ContactsApp
    - SearchBar
    - ContactList
        - ContactItem

Given this component tree and the requirement to 
filter the contactlist based on the searchargument, 
which ones are stateless, which ones are statefull?


---
### Example Quiz (Answer)
- ContactsApp -> Statefull
    - SearchBar -> Stateless
    - ContactList -> Stateless
        - ContactItem -> Stateless

The common owner is ContactsApp
But how does the SearchBar communicates changes back to the ContactsApp?

---
### Data Flow and Component Communication
- React only allows downward data flow
- Upward communications can be done using callbacks

example
```js
class SearchBar extends Component {
    handleChange(event){ this.props.onUserInput(event.target.value)}
    render() { return <input type="search" 
        value={this.props.filterText} 
        onChange={this.handleChange.bind(this)} />
}

// inside contactsApp
...
render() { <div><SearchBar 
    fiterText={this.state.filterText} 
    onUserInput={this.handleInput.bind(this)}
}
...
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Component communication

---
### Lifecycle Functions Best Practice
Data Fetching
- fetch data in the componentDidMount lifecycle callback

* good practice tip: data fetching logic should be done in a dedicated component

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Lifecycle Data Fetch demo

---
### Immutability 
- Objects and Arrays are passed as references
- Replace objects instead of changing them leads to better performance
- Be carefull here, for instance
    - pushing into array does not replace the array but changes it!
    - this leads to poor performance
- Use non-destructive methods like concat, map and filter

```js
    // instead of
    let contacts = this.state.contacts;
    contacts.push({name:"john", email:"john.gorter@gmail.com"});
    this.setState({contacts:contacts});

    // use this code
    let contacts = this.state.contacts.concat('john');
    this.setState({contacts:contacts});
```

---
### Object Assign
Alternative for generating new objects with mutations
```js
let updatedContact = Object.assign({}, this.state.contact, { name:'john'});
this.setState({contact:updatedContact});
```

---
### More complex scenario
- Suppose you have an Object in an object
    - Contact has ContactInfo
- Suppose you would use Object.Assign
```js   
    ...
    originalContact = { name:"john", email:"john.gorter@gmail.com", ContactInfo: { phone:"0612345678" }};
     ...

    let newContact = Object.Assign({}, originalContact, { name:"john"});
```

* In this case you have two objects refer to the same ContactInfo instance
* Changing the ContactInfo.phone in one reflects on the other.. 
* This is how JavaScript works
* This problem goes for nested arrays aswell
* Do not deepclone, this causes performance issues

---
### React Immutability Helper
To provide for the previous scenario, React has a helper

install it:
```js
npm install immutability-helper --save
```
use it:
```js
import update from 'react-addons-update';
let contact = { name:"john", ContactInfo : { phone:"06-12345678"}};
let newContact = update(contact, { ContactInfo: { phone:{$set:"0318-123456"}}});
```

---
### React Immutability Helper
Or in case of an array

```js
import update from 'react-addons-update';
let contact = { name:"john", phones:["06-12345678", "0314-123456"]};
let newContact = update(contact, { phones:{$push:["0318-123456"]}});
// -or replace the array entirely-
let newContact = update(contact, { phones:{$set:["0318-123456"]}});
// -or replace an index of an array -
let newContact = update(contact, { phones:{ 0:{$set:["0318-123456"]}}});
```

---
### React Immutability Helper
Available Commands

Command | Description
--- | ---
$push | Similar to Array's push
$unshift | Similar to Array's unshift (add to beginning)
$splice | Similar to Array's splice (remove and/or add elements)
$set | Replace the target
$merge | Merge the keys of the given object with the target
$apply | Pass the current value to the given function and update
$remove | Remove the list of keys in array from a
..more  | 

---
### React Immutability Helper
Example $apply
```js
let obj = {a: 5, b: 3};
let newObj = update(obj, { b: { $apply: (value) => value*2 }});
// => { a: 5, b: 6 };
```

---
### Optimistic Updates Rollback
Because of immutable structures, rollbacks are easy to implement
- just keep a reference to the original object

```js
let prevState = this.state;
...
fetch(..., {}).then(response => {
    if (!response.ok) throw new Error("Not OK!");
}).catch(error => {
    console.warn("Error", error);
    this.setState(prevState);
});
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Immutability Helper

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Build a complete application