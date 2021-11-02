# Unit testing in React

You can test React components similar to testing other JavaScript code

---
## Unit testing in React

There are a few ways to test React components
- rendering component trees in a simplified test environment and asserting on their output
- running a complete app in a realistic browser environment 
    - also known as “end-to-end” tests

Lets examine the first...

---
### Tradeoffs
When choosing testing tools, there are a few tradeoffs
- Iteration speed vs Realistic environment
    - Some tools offer a very quick feedback loop between making a change and seeing the result, but don’t model the browser behavior precisely
    - Other tools might use a real browser environment, but reduce the iteration speed and are flakier on a continuous integration server

---
### Recommended Tools
- Jest 
    - a JavaScript test runner that lets you access the DOM via jsdom
- React Testing Library 
    - a set of helpers that let you test React components without relying on their implementation details

