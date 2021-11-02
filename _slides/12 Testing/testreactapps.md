# Testing React Apps

---
### Setup
Use Create React App 

It is ready to use and ships with Jest! 

You will only need to add react-test-renderer for rendering snapshots.

Run
```
yarn add --dev react-test-renderer
```

---
### Setup without Create React App
If you have an existing application you'll need to install a few packages to make everything work well together. 

We use the babel-jest package and the react babel preset to transform the code 

Run
```
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```


---
### Setup without Create React App
Your package.json should look something like this 
```
  "dependencies": {
    "react": "<current-version>",
    "react-dom": "<current-version>"
  },
  "devDependencies": {
    "@babel/preset-env": "<current-version>",
    "@babel/preset-react": "<current-version>",
    "babel-jest": "<current-version>",
    "jest": "<current-version>",
    "react-test-renderer": "<current-version>"
  },
  "scripts": {
    "test": "jest"
  }
```
---
### Setup without Create React App

babel.config.js
```
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```
And you're good to go!

---
### Snapshot Testing
Let's create a snapshot test for a Link component that renders hyperlinks:
```
// Link.react.js
import React, {useState} from 'react';

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

const Link = ({page, children}) => {
  const [status, setStatus] = useState(STATUS.NORMAL);

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED);
  };

  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL);
  };

  return (
    <a
      className={status}
      href={page || '#'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
};

export default Link;
```

---
### Snapshot Testing

Now let's use React's test renderer and Jest's snapshot feature to interact with the component 
```
// Link.react.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link.react';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
```

---
### Snapshot Testing

When you run yarn test or jest, this will produce an output file like this:
```
__tests__/__snapshots__/Link.react.test.js.snap
exports[`Link changes the class when hovered 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 2`] = `
<a
  className="hovered"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 3`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;
```

---
### Snapshot Testing
The next time you run the tests
- the rendered output will be compared to the previously created snapshot
- the snapshot should be committed along with code changes

When a snapshot test fails, you need to inspect whether it is an intended or unintended change 
- if the change is expected, invoke Jest with jest -u to overwrite the existing snapshot


---
### DOM Testing
If you'd like to assert, and manipulate your rendered components you can use react-testing-library, Enzyme, or React's TestUtils
 
 
The following two examples use react-testing-library and Enzyme.

---
### react-testing-library

You have to run 
```
yarn add --dev @testing-library/react
``` 
to use react-testing-library

---
### react-testing-library
Let's implement a checkbox which swaps between two labels:

```
// CheckboxWithLabel.js
import React, {useState} from 'react';

const CheckboxWithLabel = ({labelOn, labelOff}) => {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? labelOn : labelOff}
    </label>
  );
};

export default CheckboxWithLabel;
```

---
### react-testing-library
Now the test:
```
// __tests__/CheckboxWithLabel-test.js
import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';
import CheckboxWithLabel from '../CheckboxWithLabel';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const {queryByLabelText, getByLabelText} = render(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />,
  );

  expect(queryByLabelText(/off/i)).toBeTruthy();

  fireEvent.click(getByLabelText(/off/i));

  expect(queryByLabelText(/on/i)).toBeTruthy();
});
```

---
### Enzyme
You have to run 
```
yarn add --dev enzyme
``` 
to use Enzyme 

If you are using a React version below 15.5.0, you will also need to install react-addons-test-utils

---
### Enzyme
Let's rewrite the test from above using Enzyme instead of react-testing-library. We use Enzyme's shallow renderer in this example

```
// __tests__/CheckboxWithLabel-test.js
import React from 'react';
import {shallow} from 'enzyme';
import CheckboxWithLabel from '../CheckboxWithLabel';

test('CheckboxWithLabel changes the text after click', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

  expect(checkbox.text()).toEqual('Off');

  checkbox.find('input').simulate('change');

  expect(checkbox.text()).toEqual('On');
});
```

---
### Custom transformers
If you need more advanced functionality, you can also build your own transformer

Instead of using babel-jest, here is an example of using @babel/core:
```
// custom-transformer.js
'use strict';

const {transform} = require('@babel/core');
const jestPreset = require('babel-preset-jest');

module.exports = {
  process(src, filename) {
    const result = transform(src, {
      filename,
      presets: [jestPreset],
    });

    return result || src;
  },
};
```
Don't forget to install the @babel/core and babel-preset-jest packages for this example to work.

---
### Custom transformers
To make this work with Jest you need to update your Jest configuration with this

```
"transform": {"\\.js$": "path/to/custom-transformer.js"}
```

---
### Custom transformers
If you'd like to build a transformer with babel support, you can also use babel-jest to compose one and pass in your custom configuration options
```
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['my-custom-preset'],
});
```

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using react app testing

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using react app testing

