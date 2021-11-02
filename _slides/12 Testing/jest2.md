# Jest

---
### Jest

Install Jest using yarn:
```
yarn add --dev jest
```
Or npm:
```
npm install --save-dev jest
```

---
### Getting started
Write a test for a function that adds two numbers
 
First, create a sum.js file:
```
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

---
### Getting started
create a file named sum.test.js
```
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

---
### Getting started
Add the following section to your package.json:
```
{
  "scripts": {
    "test": "jest"
  }
}
```
Finally, run yarn test or npm run test 

```
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

You just successfully wrote your first test using Jest!


---
### Running from command line
You can run Jest directly from the CLI 

``` 
yarn global add jest
```
or npm 
```
install jest --global
```

---
### Usage

Here's how to run Jest on files matching my-test
- using config.json 
- display a native OS notification after the run
```
jest my-test --notify --config=config.json
```

---
### Additional Configuration
Generate a basic configuration file
```
jest --init
```

---
### Using Babel
To use Babel, install required dependencies via yarn
```
yarn add --dev babel-jest @babel/core @babel/preset-env
```

Configure Babel to target your current version of Node by creating a babel.config.js file in the root of your project
```
// babel.config.js
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

---
### Using webpack
Jest can be used in projects that use webpack to manage assets, styles, and compilation


---
### Using TypeScript
Jest supports TypeScript, via Babel

First, make sure you followed the instructions on using Babel above

Next, install the @babel/preset-typescript via yarn
```
yarn add --dev @babel/preset-typescript
```
Then add @babel/preset-typescript to the list of presets in your babel.config.js.
```
babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```
