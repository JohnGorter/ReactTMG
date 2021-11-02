# Jest
Jest test runner

---
### Setup
use Create React App. It is ready to use and ships with Jest! 

> You will only need to add react-test-renderer for rendering snapshots

Run
```
yarn add --dev react-test-renderer
```

---
### Setup without Create React App
If you have an existing application
Run
```
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```

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
babel.config.js
```
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

---
### Snapshot Testing
Let's create a snapshot test for a Link component that renders hyperlinks

Link.react.js
```
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

Now let's use React's test renderer and Jest's snapshot feature to interact with the component and capture the rendered output and create a snapshot file

Link.react.test.js
```
import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link.react';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.johngorter.com">John's page</Link>,
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
  href="http://www.johngorter.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 2`] = `
<a
  className="hovered"
  href="http://www.johngorter.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;

exports[`Link changes the class when hovered 3`] = `
<a
  className="normal"
  href="http://www.johngorter.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}>
  Facebook
</a>
`;
```

The next time you run the tests, the rendered output will be compared to the previously created snapshot. 

---
### Snapshot Testing

The snapshot should be committed along with code changes. 

When a snapshot test fails, you need to inspect whether it is an intended or unintended change. 

If the change is expected you can invoke Jest with jest -u to overwrite the existing snapshot.


The code for this example is available at examples/snapshot.

Snapshot Testing with Mocks, Enzyme and React 16#
There's a caveat around snapshot testing when using Enzyme and React 16+. If you mock out a module using the following style:

jest.mock('../SomeDirectory/SomeComponent', () => 'SomeComponent');
Then you will see warnings in the console:

Warning: <SomeComponent /> is using uppercase HTML. Always use lowercase HTML tags in React.

# Or:
Warning: The tag <SomeComponent> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
React 16 triggers these warnings due to how it checks element types, and the mocked module fails these checks. Your options are:

Render as text. This way you won't see the props passed to the mock component in the snapshot, but it's straightforward:
jest.mock('./SomeComponent', () => () => 'SomeComponent');
Render as a custom element. DOM "custom elements" aren't checked for anything and shouldn't fire warnings. They are lowercase and have a dash in the name.
jest.mock('./Widget', () => () => <mock-widget />);
Use react-test-renderer. The test renderer doesn't care about element types and will happily accept e.g. SomeComponent. You could check snapshots using the test renderer, and check component behavior separately using Enzyme.
Disable warnings all together (should be done in your jest setup file):
jest.mock('fbjs/lib/warning', () => require('fbjs/lib/emptyFunction'));
This shouldn't normally be your option of choice as useful warnings could be lost. However, in some cases, for example when testing react-native's components we are rendering react-native tags into the DOM and many warnings are irrelevant. Another option is to swizzle the console.warn and suppress specific warnings.
DOM Testing#
If you'd like to assert, and manipulate your rendered components you can use react-testing-library, Enzyme, or React's TestUtils. The following two examples use react-testing-library and Enzyme.

react-testing-library#
You have to run yarn add --dev @testing-library/react to use react-testing-library.

Let's implement a checkbox which swaps between two labels:

CheckboxWithLabel.js
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
__tests__/CheckboxWithLabel-test.js
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
The code for this example is available at examples/react-testing-library.

Enzyme#
You have to run yarn add --dev enzyme to use Enzyme. If you are using a React version below 15.5.0, you will also need to install react-addons-test-utils.

Let's rewrite the test from above using Enzyme instead of react-testing-library. We use Enzyme's shallow renderer in this example.

__tests__/CheckboxWithLabel-test.js
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
The code for this example is available at examples/enzyme.

Custom transformers#
If you need more advanced functionality, you can also build your own transformer. Instead of using babel-jest, here is an example of using @babel/core:

custom-transformer.js
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
Don't forget to install the @babel/core and babel-preset-jest packages for this example to work.

To make this work with Jest you need to update your Jest configuration with this: "transform": {"\\.js$": "path/to/custom-transformer.js"}.

If you'd like to build a transformer with babel support, you can also use babel-jest to compose one and pass in your custom configuration options:

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['my-custom-preset'],
});
See dedicated docs for more details.


https://www.codecademy.com/courses/learn-react-testing
