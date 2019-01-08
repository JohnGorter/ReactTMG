# Routing

---
### Routing
- Store state in the url and history of the browser
- Provide deep linking to app pages
- Makes the forward and back buttons of the browser work intuitively

React makes routing based on urls easy

---
### Simple Routing
Render different component based on the current url

step 1. listen for url changes

```js
class MyApp extends Component {
    componentDidMount(){
        window.addEventListener("hashchange", () => {
            this.setState({
                route: window.location.hash.substr(1);
            })
        });
    }
```

---
### Simple Routing
Render different component based on the current url

step 2. render component that matches rout

```js
    render(){
        var Child;
        switch(this.state.route) {
            case '/about': Child = About; break;
            case '/repos': Child = Repos; break;
            default: Child = Home;
        }
```

---
### Simple Routing
Render different component based on the current url

step 3. return correct component and render links

```js
    return (
        <div>
            <header>MyApp</header>
            <menu>
                <ul>
                    <li><a href="#/about">About</a></li>
                    <li><a href="#/repos">Repos</a></li>
                </ul>
            </menu>
        </div>
    )
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Simple Routing

---
### Routing

That worked but
- Code is very URL centered
- URL parsing for more complex routing can be difficult

* Enter the React Router Libraries
https://reacttraining.com/react-router/core/guides/philosophy


---
### React Router
React Router is an external library that contains the core
- Most popular router for React
- Mounts and Unmounts automatically when url changes
- Differentiates between deeplink and programmatic state changes
    - more on this later

Needs to be completed with a platform instance
- react-router-dom for browser routing
- react-router-native for native apps

---
### React Router Setup
Since this is an external library, it needs to be installed
from npm 
```js
$ npm install --save react-router react-router-dom
```
or cdn
- https://unpkg.com/react-router-dom/umd/react-router-dom.min.js
- https://unpkg.com/react-router/umd/react-router.min.js

---
### React Router Components
The React Router contains the following components
- Router and Route
    - Declaratively maps routes
- Link
    - Creates A tags with href attributes

* Router contains all content

---
### React Router example
The root rendering looks like

```js
  ReactDOM.render((
      <BrowserRouter>
        <MyApp />
      </BrowserRouter>
  ), document.querySelector("#root"));
```

---
### React Router example

The updated component now looks like this
```js
class Home extends Component {
    render(){
       return (
            <div>
                <header>My Application</header>
                <menu>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </menu>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/about' component={About}/>
                    <Route path='/home' component={Home}/>
                </Switch>
            </div>
        );
    }
}
```
* component can be render function
    - Usefull when injecting extra properties

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Routing

---
### More Routing
There is more to routing 
- child routes aka Nested routes
    - example /about/details and /about/overview
- Parameterised routes
    - example /blog/:id

---
### Child Routes
To implement child/nested routes, add routing to your child component
```js
class About extends Component {
    render(){
        return (
             <Switch>
                <Route exact path='*/details' component={AboutDetails}/>
                <Route path='/about/overview' component={AboutOverview}/>
            </Switch>
        );
    }
}
```

* Note the two different options here..

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Child Routes

---
### Parameterised Routes
Suppose we want to extract and use parameters from a route
> /blog/:id  

where :id is a placeholder for the blog id in the database

How to implement this?

---
### Parameterised Routes
Create a route to it first
```html
<Route path='/blog/:id' component={Blog}/>
```

---
### Parameterised Routes
then use it in your component
```js
const blog = BlogAPI.get(
    parseInt(props.match.params.id, 10)
  )
  if (!blog) {
    return <div>Sorry, but the blog was not found</div>
  }
  return (
    <div>
      <h1>{blog.title}</h1>
      <h2>{blog.content}</h2>
    </div>
)
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Parameterised Routes

---
### Programatically change route
To change to a route programmatically, you can inject Router 
properties to your class

```js
 // define a class to use 
 let MyButton = React.createClass({
        render(){
           return (
                <button onClick={
                    () => this.props.history.push('/Blog/10')
                }>Go to specific blog</button>
            )
        }
    });
    // inject properties for the new class with Router stuff
    let RouteButton = ReactRouterDOM.withRouter(MyButton);
```
* note the call to createClass here!

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
React Programmatically navigate to route


https://stackoverflow.com/questions/42123261/programmatically-navigate-using-react-router-v4


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Routing