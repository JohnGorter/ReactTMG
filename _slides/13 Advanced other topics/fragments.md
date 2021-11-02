# Fragments

---
### Fragments
A component that return multiple elements

> Fragments let you group a list of children without adding extra nodes to the DOM

---
### Fragments example
```
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

---
### Fragments example
There is also a new short syntax for declaring them.
```
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```
`Columns /` would need to return multiple `td` elements 
- if a parent div was used inside the render() of `Columns` the resulting HTML will be invalid.

---
### Fragments example
```
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```
results in a `Table` output of:
```
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

---
### Fragments example
Fragments solve this problem.

```
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```
which results in a correct `Table` output of:
```
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

---
### Short Syntax
There is a new, shorter syntax you can use for declaring fragments. It looks like empty tags:
```
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```
You can use these the same way you’d use any other element except that it doesn’t support keys or attributes

---
### Keyed Fragments
Fragments declared with the explicit `React.Fragment` syntax may have keys 

A use case for this is mapping a collection to an array of fragments 
- for example, a description list:

```
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
key is the only attribute that can be passed to Fragment


<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using fragments

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using fragments