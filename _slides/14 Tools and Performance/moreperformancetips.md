# Performance

---
### List of performance tips

Internally, React uses several clever techniques to minimize the number of costly DOM operations required to update the UI. 

Ways where you can speed up your React application

---
### Immutables 

Data immutability has many benefits, such as:
- Zero side-effects
- Immutable data objects are simpler to create, test, and use
- Helps prevent temporal coupling
- Easier to track changes

In React changes to the state can cause the component to re-render
On re-render, React compares the newly returned element with the previously
When the two are not equal, React will update the DOM

---
### Immutables 
Let’s consider a User List Component
```
state = {
       users: []
   }

   addNewUser = () =>{
       /**
        *  OfCourse not correct way to insert
        *  new user in user list
        */
       const users = this.state.users;
       users.push({
           userName: "robin",
           email: "email@email.com"
       });
       this.setState({users: users});
   }
```

The concern here is that we are pushing new users onto the variable users, which is a reference to this.state.users.

So what’s wrong with mutating state directly? 

---
### Immutables 
Let’s consider a User List Component:

Let’s say we overwrite shouldComponentUpdate and are checking nextState against this.state to make sure that we only re-render components when changes happen in the state:
```
 shouldComponentUpdate(nextProps, nextState) {
    if (this.state.users !== nextState.users) {
      return true;
    }
    return false;
  }
```

Even if changes happen in the user's array, React won’t re-render the UI as it’s the same reference

---
### Immutables 

Avoid mutating props or state:
```
   addNewUser = () => {
       this.setState(state => ({
         users: state.users.concat({
           timeStamp: new Date(),
           userName: "robin",
           email: "email@email.com"
         })
       }));
   };
```

---
### Immutables 
For handling changes to state or props in React components, consider the following immutable approaches:
- For arrays: use [].concat or es6 [ ...params]
- For objects: use Object.assign({}, ...) or es6 {...params}

These two methods go a long way when introducing immutability to your code base

---
### Immutables 
There are optimized libraries which provides a set of immutable data structures

- Immutability Helper
- Immutable.js
- Seamless-immutable
- React-copy-write


---
### Function/Stateless Components and React.PureComponent
React provides two different ways of optimizing React apps at the component level
- function components 
- PureComponent 

Function components prevent constructing class instances while reducing the overall bundle size as it minifies better than classes

In order to optimize UI updates, consider converting function components to a PureComponent class (or a class with a custom shouldComponentUpdate method). 

---
### When use React.PureComponent?

React.PureComponent does a shallow comparison on state change. 

Two criteria are met when using React.PureComponent
- Component State/Props is an immutable object;
- State/Props should not have a multi-level nested object.

> All child components of React.PureComponent should also be a Pure or functional component.

---
### Multiple Chunk Files
Your application always begins with a few components. You start adding new features and dependencies, and before you know it, you end up with a huge production file.

Separate files by separating your vendor, or third-party library code from your application code by using CommonsChunkPlugin for webpack
- vendor.bundle.js 
- app.bundle.js 

By splitting your files, your browser caches less frequently and parallel downloads resources to reduce load time wait

> If you are using the latest version of webpack, you can also consider SplitChunksPlugin

---
### Using Production Mode Flag in Webpack
If you are using webpack 4 as a module bundler for your app, consider setting the mode option to production

This tells webpack to use the built-in optimization:
```
    module.exports = {
      mode: 'production'
    };
```

Alternatively, you can pass it as a CLI argument:
```
webpack --mode=production
```

Doing this will limit optimizations, such as minification or removing development-only code, to libraries. It will not expose source code, file paths, and many more.

---
### Dependency optimization
When considering optimizing the application bundle size, it’s worth checking how much code you are actually utilizing from dependencies

For example, you could be 
- Moment.js which includes localized files for multi-language support

If you don’t need to support multiple languages, then you can consider using moment-locales-webpack-plugin to remove unused locales for your final bundle

- loadash. 

If you only use 20 of the 100+ methods, then having all the extra methods in your final bundle is not optimal. So for this, you can use lodash-webpack-plugin to remove unused functions.


---
### Use React.Fragments to Avoid Additional HTML Element Wrappers
React.fragments lets you group a list of children without adding an extra node
```
class Comments extends React.PureComponent{
    render() {
        return (
            <React.Fragment>
                <h1>Comment Title</h1>
                <p>comments</p>
                <p>comment time</p>
            </React.Fragment>
        );
    } 
}
```
But wait! There is the alternate and more concise syntax using React.fragments:
```
class Comments extends React.PureComponent{
    render() {
        return (
            <>
                <h1>Comment Title</h1>
                <p>comments</p>
                <p>comment time</p>
            </>
        );
    } 
}
```

---
### Avoid Inline Function Definition in the Render Function
Since functions are objects in JavaScript ({} !== {}), the inline function will always fail the prop diff when React does a diff check. 

Also, an arrow function will create a new instance of the function on each render if it's used in a JSX property. 

This might create a lot of work for the garbage collector.
```
default class CommentList extends React.Component {
    state = {
        comments: [],
        selectedCommentId: null
    }

    render(){
        const { comments } = this.state;
        return (
           comments.map((comment)=>{
               return <Comment onClick={(e)=>{
                    this.setState({selectedCommentId:comment.commentId})
               }} comment={comment} key={comment.id}/>
           }) 
        )
    }
}
```

---
### Avoid Inline Function Definition in the Render Function
Instead of defining the inline function for props, you can define the arrow function.
```
default class CommentList extends React.Component {
    state = {
        comments: [],
        selectedCommentId: null
    }

    onCommentClick = (commentId)=>{
        this.setState({selectedCommentId:commentId})
    }

    render(){
        const { comments } = this.state;
        return (
           comments.map((comment)=>{
               return <Comment onClick={this.onCommentClick} 
                comment={comment} key={comment.id}/>
           }) 
        )
    }
}
8. Throttling and Debouncing Event Action in JavaScript
Event trigger rate is the number of times an event handler invokes in a given amount of time.

In general, mouse clicks have lower event trigger rates compare to scrolling and mouseover. Higher event trigger rates can sometimes crash your application, but it can be controlled.

Let's discuss some of the techniques.

First, identify the event handler that is doing the expensive work. For example, an XHR request or DOM manipulation that performs UI updates, processes a large amount of data, or perform computation expensive tasks. In these cases, throttling and debouncing techniques can be a savior without making any changes in the event listener.

---
### Throttling
In a nutshell, throttling means delaying function execution. So instead of executing the event handler/function immediately, you’ll be adding a few milliseconds of delay when an event is triggered. This can be used when implementing infinite scrolling, for example. Rather than fetching the next result set as the user is scrolling, you can delay the XHR call.

Another good example of this is Ajax-based instant search. You might not want to hit the server for every key press, so it’s better to throttle until the input field is dormant for a few milliseconds

Throttling can be implemented a number of ways. You can throttle by the number of events triggered or by the delay event handler being executed.

Debouncing
Unlike throttling, debouncing is a technique to prevent the event trigger from being fired too often. If you are using lodash, you can wrap the function you want to call in lodash’s debounce function.

Here’s a demo code for searching comments:

import debouce from 'lodash.debounce';

class SearchComments extends React.Component {
 constructor(props) {
   super(props);
   this.state = { searchQuery: “” };
 }

 setSearchQuery = debounce(e => {
   this.setState({ searchQuery: e.target.value });

   // Fire API call or Comments manipulation on client end side
 }, 1000);

 render() {
   return (
     <div>
       <h1>Search Comments</h1>
       <input type="text" onChange={this.setSearchQuery} />
     </div>
   );
 }
}
If you are not using lodash, you can use the minified debounced function to implement it in JavaScript.

function debounce(a,b,c){var d,e;return function(){function h(){d=null,c||(e=a.apply(f,g))}var f=this,g=arguments;return clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e}}
Reference and Related Articles:
"Array" Methods,
Handling Events

9. Avoid using Index as Key for map
You often see indexes being used as a key when rendering a list.

{
    comments.map((comment, index) => {
        <Comment 
            {..comment}
            key={index} />
    })
}
But using the key as the index can show your app incorrect data as it is being used to identify DOM elements. When you push or remove an item from the list, if the key is the same as before, React assumes that the DOM element represents the same component.

It's always advisable to use a unique property as a key, or if your data doesn't have any unique attributes, then you can think of using the shortid module which generates a unique key.

import shortid from  "shortid";
{
    comments.map((comment, index) => {
        <Comment 
            {..comment}
            key={shortid.generate()} />
    })
}
However, if the data has a unique property, such as an ID, then it's better to use that property.

{
    comments.map((comment, index) => {
        <Comment 
            {..comment}
            key={comment.id} />
    })
}
In certain cases, it's completely okay to use the index as the key, but only if below condition holds:

The list and items are static
The items in the list don't have IDs and the list is never going to be reordered or filtered
List is immutable
References and Related Articles:
Consider providing a default key for dynamic children #1342,
The importance of component keys in React.js,
Why you need keys for collections in React

10. Avoiding Props in Initial States
We often need to pass initial data with props to the React component to set the initial state value.

Let's consider this code:

class EditPanelComponent extends Component {
    
    constructor(props){
        super(props);

        this.state ={
            isEditMode: false,
            applyCoupon: props.applyCoupon
        }
    }

    render(){
        return <div>
                    {this.state.applyCoupon && 
                    <>Enter Coupon: <Input/></>}
               </div>
    }
}
Everything looks good in the snippet, right?

But what happens when props.applyCoupon changes? Will it be reflected in the state? If the props are changed without the refreshing the component, the new prop value will never be assigned to the state’s applyCoupon. This is because the constructor function is only called when EditPanelComponent is first created.

To quote React docs:

Using props to initialize a state in constructor function often leads to duplication of “source of truth”, i.e. where the real data is. This is because constructor function is only invoked when the component is first created.

Workaround:

Don't initialize state with props which can be changed later. Instead, use props directly in the component.
class EditPanelComponent extends Component {
    
    constructor(props){
        super(props);

        this.state ={
            isEditMode: false
        }
    }

    render(){
        return <div>{this.props.applyCoupon && 
         <>Enter Coupon:<Input/></>}</div>
    }
} 
You can use componentWillReceiveProps to update the state when props change.
class EditPanelComponent extends Component {
    
    constructor(props){
        super(props);

        this.state ={
            isEditMode: false,
            applyCoupon: props.applyCoupon
        }
    }

    // reset state if the seeded prop is updated
    componentWillReceiveProps(nextProps){
        if (nextProps.applyCoupon !== this.props.applyCoupon) {
            this.setState({ applyCoupon: nextProps.applyCoupon })
        }
    }

    render(){
        return <div>{this.props.applyCoupon && 
          <>Enter Coupon: <Input/></>}</div>
    }
}
References and Related Articles:
ReactJS: Why is passing the component initial state a prop an anti-pattern?,
React Anti-Patterns: Props in Initial State

React CTA.png

11. Spreading props on DOM elements
You should avoid spreading properties into a DOM element as it adds unknown HTML attribute, which is unnecessary and a bad practice.

const CommentsText = props => {
    return (
      <div {...props}>
        {props.text}
      </div>
    );
  };
Instead of spreading props, you can set specific attributes:

const CommentsText = props => {
    return (
      <div specificAttr={props.specificAttr}>
        {props.text}
      </div>
    );
};
12. Use Reselect in Redux to Avoid Frequent Re-render
Reselect is a simple selector library for Redux, which can be used for building memorized selectors. You can define selectors as a function, retrieving snippets of the Redux state for React components.

Let's take a look at this code that isn’t using Reselect:

const App = ({ comments, socialDetails }) => (
    <div>
      <CommentsContainer data={comments} />
      <ShareContainer socialDetails={socialDetails} />
    </div>
  );
  
  const addStaticPath = social => ({
    iconPath: `../../image/${social.iconPath}`
  });
  
  App = connect(state => {
    return {
        comments: state.comments,
        socialDetails: addStaticPath(state.social)
    };
  })(App);
In this code, every time the comments data in state changes, both CommentsContainer and ShareContainer will be re-rendered. This happens even when addStaticPath doesn't make any data changes to socialDetails as addStaticPath will return a new object with a different identity (remember {} != {}). Now, if we rewrite addStaticPath with Reselect, the issue will go away as Reselect will return the last function result until it is passed new inputs.

import { createSelector } from "reselect";
const socialPathSelector = state => state.social;
const addStaticPath = createSelector(
  socialPathSelector,
  social => ({
    iconPath: `../../image/${social.iconPath}`
  })
);
References and Related Articles:
Reselect: Motivation for Memoized Selectors,
Improving React and Redux performance with Reselect,
Using reselect

13. Avoid Async Initialization in componentWillMount()
componentWillMount() is only called once and before the initial render. Since this method is called before render(), our component will not have access to the refs and DOM element.

Here’s a bad example:

function componentWillMount() {
  axios.get(`api/comments`)
    .then((result) => {
      const comments = result.data
      this.setState({
        comments: comments
      })
    })
}
Let’s make it better by making async calls for component initialization in the componentDidMount lifecycle hook:

function componentDidMount() {
  axios.get(`api/comments`)
    .then((result) => {
      const comments = result.data
      this.setState({
        comments: comments
      })
    })
} 
The componentWillMount() is good for handling component configurations and performing synchronous calculation based on props since props and state are defined during this lifecycle method.

14. Memoize React Components
Memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again. A memoized function is usually faster because if the function is called with the same values as the previous one then instead of executing function logic it would fetch the result from cache.

Let's consider below simple stateless UserDetails React component.

const UserDetails = ({user, onEdit}) => {
    const {title, full_name, profile_img} = user;

    return (
        <div className="user-detail-wrapper">
            <img src={profile_img} />
            <h4>{full_name}</h4>
            <p>{title}</p>
        </div>
    )
}
Here, all the children in UserDetails are based on props. This stateless component will re-render whenever props changes. If the UserDetails component attribute is less likely to change, then it's a good candidate for using the memoize version of the component:

import moize from 'moize';

const UserDetails = ({user, onEdit}) =>{
    const {title, full_name, profile_img} = user;

    return (
        <div className="user-detail-wrapper">
            <img src={profile_img} />
            <h4>{full_name}</h4>
            <p>{title}</p>
        </div>
    )
}

export default moize(UserDetails,{
    isReact: true
}); 
This method will do a shallow equal comparison of both props and context of the component based on strict equality.

If you are using React V16.6.0 or greater version, then you can use React.memo and rewrite the above code like:

const UserDetails = ({user, onEdit}) =>{
    const {title, full_name, profile_img} = user;

    return (
        <div className="user-detail-wrapper">
            <img src={profile_img} />
            <h4>{full_name}</h4>
            <p>{title}</p>
        </div>
    )
}

export default React.memo(UserDetails)
The following links can be useful if you would like to know more about some of the topics from this article in more detail:

How I wrote the world’s fastest React memoization library
Memoize React components
theKashey/react-memoize
How to use Memoize to cache JavaScript function results and speed up your code
NPM: Moize
Higher Order Functions
15. CSS Animations Instead of JS Animations
Animations are inevitable for a fluid and pleasurable user experience. There are many ways to implement web animations. Generally speaking, we can create animations three ways:

CSS transitions
CSS animations
JavaScript
Which one we choose depends on the type of animation we want to add.

When to use CSS-based animation:

To add "one-shot" transitions, like toggling UI elements state;
For smaller, self-contained states for UI elements. For example showing a tooltip or adding a hovering effect for the menu item, etc.
When to use JavaScript-based animations:

When you want to have advanced effects, for example bouncing, stop, pause, rewind, slow down or reverse;
When you need significant control over the animation;
When you need to trigger the animation, like mouseover, click, etc;
When using requestAnimationFrame for visual changes.
Let’s say, for example, you wanted to animate a 4-state div on mouseover. The four stages of div changes the background color from red to blue, blue to green, green to yellow, before rotating 90 degrees. In this case, you would need to use a combination of JavaScript animation and CSS transition to provide better control of the action and state changes.

References and Related Articles: CSS and JavaScript animation performance,
CSS Versus JavaScript Animations, Optimize JavaScript Execution

16. Using a CDN
A CDN is a great way to deliver static content from your website or mobile application to your audience more quickly and efficiently.

CDN depends on user geographic location. The CDN server closest to a user is known as an “edge server”. When the user requests content from your website, which is served through a CDN, they are connected to edge server and are ensured the best online experience possible.

There are some great CDN providers out there. For example, CloudFront, CloudFlare, Akamai, MaxCDN, Google Cloud CDN, and others.

You can also choose Netlify or Surge.sh to host your static content on CDN. Surge is a free CLI tool that deploys your static projects to production-quality CDN.

References and Related Articles:
Why you should use a content delivery network

17. Using Web Workers for CPU Extensive Tasks
Web Workers makes it possible to run a script operation in a web application’s background thread, separate from the main execution thread. By performing the laborious processing in a separate thread, the main thread, which is usually the UI, is able to run without being blocked or slowed down.

In the same execution context, as JavaScript is single threaded, we will need to parallel compute. This can be achieved two ways. The first option is using pseudo-parallelism, which is based on setTimeout function. The second option is to use Web Workers.

Web Workers works best when executing computation extensive operation since it executes code independent of other scripts in a separate thread in the background. This means it doesn’t affect the page’s performance.

We can take advantage of Web Workers in React to execute computation extensive tasks.

Here’s a code without using Web Workers:

// Sort Service for sort post by the number of comments 
function sort(posts) {
    for (let index = 0, len = posts.length - 1; index < len; index++) {
        for (let count = index+1; count < posts.length; count++) {
            if (posts[index].commentCount > posts[count].commentCount) {
                const temp = posts[index];
                posts[index] = users[count];
                posts[count] = temp;
            }
        }
    }
    return posts;
}

export default Posts extends React.Component{

    constructor(props){
        super(posts);
    }

    state = {
        posts: this.props.posts
    }

    doSortingByComment = () => {
        if(this.state.posts && this.state.posts.length){
            const sortedPosts = sort(this.state.posts);
            this.setState({
                posts: sortedPosts
            });
        }
    }

    render(){
        const posts = this.state.posts;
        return (
            <React.Fragment>
                <Button onClick={this.doSortingByComment}>
                    Sort By Comments
                </Button>
                <PostList posts={posts}></PostList>
            </React.Fragment>
        )
    }
}
What happens when we have 20,000 posts? It will slow down the rendering since the sort method time complexity is O(n^2), which will run in the same thread.

Below is the modified code, which uses Web Workers to process sorting:

// sort.worker.js

// In-Place Sort function for sort post by number of comments
export default  function sort() {
    
    self.addEventListener('message', e =>{
        if (!e) return;
        let posts = e.data;
        
        for (let index = 0, len = posts.length - 1; index < len; index++) {
            for (let count = index+1; count < posts.length; count++) {
                if (posts[index].commentCount > posts[count].commentCount) {
                    const temp = posts[index];
                    posts[index] = users[count];
                    posts[count] = temp;
                }
            }
        }
        postMessage(posts);
    });
}

export default Posts extends React.Component{

    constructor(props){
        super(posts);
    }
    state = {
        posts: this.props.posts
    }
    componentDidMount() {
        this.worker = new Worker('sort.worker.js');
        
        this.worker.addEventListener('message', event => {
            const sortedPosts = event.data;
            this.setState({
                posts: sortedPosts
            })
        });
    }

    doSortingByComment = () => {
        if(this.state.posts && this.state.posts.length){
            this.worker.postMessage(this.state.posts);
        }
    }

    render(){
        const posts = this.state.posts;
        return (
            <React.Fragment>
                <Button onClick={this.doSortingByComment}>
                    Sort By Comments
                </Button>
                <PostList posts={posts}></PostList>
            </React.Fragment>
        )
    }
}
In this code, we are running the sort method in separate thread, which will ensure we’re not blocking the main thread.

You can consider using Web Workers for tasks like image processing, sorting, filtering, and other CPU extensive tasks.

Reference: Using Web Workers

18. Virtualize Long Lists
List virtualization, or windowing, is a technique to improve performance when rendering a long list of data. This technique only renders a small subset of rows at any given time and can dramatically reduce the time it takes to re-render the components, as well as the number of DOM nodes created.

There are some popular React libraries out there, like react-window and react-virtualized, which provides several reusable components for displaying lists, grids, and tabular data.

References and Related Articles:
You don’t want to build your own list virtualization, Optimizing Performance

19. Analyzing and Optimizing Your Webpack Bundle Bloat
Before production deployment, you should check and analyze your application bundle to remove the plugins or modules that aren’t needed.

You can consider using Webpack Bundle Analyzer, which allows you to visualize the size of webpack output files with an interactive zoomable treemap.

This module will help you:

Realize what's really inside your bundle
Find out what modules take up the most size
Find modules that got there by mistake
Optimize it!
The best thing? It supports minified bundles! It parses them to get the real size of bundled modules and also shows the gzipped sizes! Here's an example of running the webpack-bundle-analyzer:

Webpack Bundle Analyzer

References and Related Articles: Analyzing & optimizing your Webpack bundle,
Analysing and minimising the size of client side bundle with webpack and source-map-explorer

20. Consider Server-side Rendering
One of the main benefits of server-side rendering is a better experience for user, as they will receive viewable content faster than they would with a client-side rendered application.

In recent years, companies like Walmart and Airbnb have adopted SSR to deliver performant user experience with React. However, rendering a large data-intensive application on the server can quickly become a performance bottleneck.

Server-side rendering provides performance benefit and consistent SEO performance. Now If you inspect React app page source without server-side rendering, it will look like this:

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/app.js"></script>
  </body>
</html>
The browser will also fetch the app.js bundle, which contains the application code and render the full page after a second or two.

React client side rendering

We can see that there are two round-trips in CSR before it reaches the server and the user can see the content. Now, if the app contains an API-driven data rendering, then there would be one more pause in the flow.

Let’s consider the same app with server-side rendering enabled:

Server side rendering in React

We see that only one trip to the server happens before the users get their content. So what exactly happens on server? When the browser requests a page, the server loads React in the memory and fetches the data required to render the app. After that, the server sends generated HTML to the browser, which is immediately shown to the user.

Here are some popular solutions that provides SSR for React apps:

Next.js
Gatsby
References and Related Articles: What’s Server Side Rendering and do I need it?, The Benefits of Server Side Rendering Over Client Side Rendering, What is React Server Side Rendering and should I use it?

21. Enable Gzip Compression on Web Server
Gzip compression allows the web server to provide a smaller file size, which means your website loads faster. The reason gzip works so well is because JavaScript, CSS, and HTML files use a lot of repeated text with lots of whitespace. Since gzip compresses common strings, this can reduce the size of pages and style sheets by up to 70%, shortening your website’s first render time.

If you are using Node/Express backend, you can use Gzipping to compress your bundle size with the compression module.

const express = require('express');
const compression = require('compression');
const app = express();

// Pass `compression` as a middleware!
app.use(compression());
Conclusion
There are many ways to optimize a React app, for example lazy loading components, using ServiceWorkers to cache application state, considering SSR, avoiding unnecessary renders etc.. That said, before considering optimization, it’s worth understanding how React components work, understanding diffing algorithms, and how rendering works in React. These are all important concepts to take into consideration when optimizing your application.

I think optimization without measuring is almost premature, which is why I would recommend to benchmark and measure performance first. You can consider profiling and visualizing components with Chrome Timeline. This lets you see which components are unmounted, mounted, updated, and how much time they take relative to each other. It will help you to get started with your performance optimization journey.

Let us know in the comments section if you have any other great React-based application optimization tips.