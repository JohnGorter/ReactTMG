# Testing

---
### Testing
Code quality consists of
- well written, maintainable code
- that does what it is supposed to do
- in a performant way
- even on heavy load

---
### Testing
Why is Unit testing important?
What does Unit testing conver?

- Test Driven Development
- Code Coverage
- Other Tests
    - Load/Stress tests
    - UI tests
    - Integration tests

--- 
### Unit Testing in React
Unit testing React Component is done with
- Jest testing platform
- the react-testing-library 
 or
- Enzyme, a JavaScript testing utility for React
    - provides a way to render a React component in  unit tests 
    - make assertions about its output and behavior


---
### React Testing Library
A very light-weight solution for testing React components. 

It provides light utility functions on top of react-dom and 
react-dom/test-utils, in a way that encourages better testing 
practices. 

Its primary guiding principle is:

> The more your tests resemble the way your software is used, 
the more confidence they can give you


---
### Setup
Install jest and enzyme 
```js
npm install — save-dev jest enzyme enzyme-adapter-react-16
```