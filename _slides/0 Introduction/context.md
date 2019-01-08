# Context

---
### Context...

- History of React
- React vs ..
- React Spinoffs
- Hello ReactJS

---
### History of React
- 2010: Facebook introduced xhp into php stack and open sourced it
- 2011: An early prototype of React
    - Jordan Walke created FaxJS, the early prototype of React
    - Search element on Facebook
- 2012: Instagram was acquired by Facebook
- 2013: JS ConfUS. Jordan Walke introduced React. React gets open sourced
- 2014: React Developer Tools becomes an extension of the Chrome Developer Tools
    - The Release of React Hot Loader

---
### History of React (2)
- 2015: React is Stable
    - Flipboard releases React Canvas
    - Netflix likes React
    - Airbnb uses React
    - Facebook released the first version of React Native 
- 2016: React gets mainstream
- 2017: The year of further improvements
    - React Fiber gets open sourced at F8 2017
    - Relicensing React, Jest, Flow, and Immutable.js
    - Netflix removes client-side React.js
- 2018: React 16.3.0 was released

---
### React Spinoffs
Popular spinoffs are
- ReactNative
    - Native Mobile React
- Preact
    - Minified browser based React
- React360
    - Virtual Reality React

---
### Hello ReactJS

First React Component with JSX
```
// React component with inline JSX (React ad-hoc class syntax)
var Banner = React.createClass({ 
   render: function() { 
      return (
      <div className={this.props.show ? '' : 'hidden'}>{this.props.message}</div>
      );
    }
});

// React component with inline JSX (React ES6 class syntax)
class Banner extends React.Component { 
    render() { 
       return (
       <div className={this.props.show ? '' : 'hidden'}>{this.props.message}</div>
       );
    }
}
```

---
### Hello ReactJS

First React Component with JavaScript
```
// React component transpiled to JavaScript 
'use strict';

var Banner = React.createClass({
  displayName: 'Banner',

  render: function render() {
    return React.createElement(
      'div',
      { className: this.props.show ? '' : 'hidden' },
      this.props.message
    );
  }
});
```

---
### Hello ReactJS

First React Functional Component 
```
// React component transpiled to JavaScript 
'use strict';

var Banner = (props) => <div className={props.show ? '':'hidden'}> {props.message}</div>;

```

---
### Hello ReactJS
Render React component to web page

```
 <body>
    <div id="banner-container"></div>
    <script type="text/babel">
    ReactDOM.render(
       <BannerContainer message="React 101!"/>,document.getElementById('banner-container')
    );
    </script>
 </body>
 ```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Hello React

