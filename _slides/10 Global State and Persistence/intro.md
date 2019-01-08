# Global State & Persistence

---
### Global State and Persistence
To store data there are options
- React Context API
- Flux

---
### React Context API
Have you ever passed a property to a React component for no other reason but just to be able to pass it down to a child of that component?

* Rearranging the leaf components can become a pain in the @$%
React Context API (new in version 16) provides a solution

---
### Clearify the problem
The problem?
For example in the example below:
- we have some data, namely a number with the value of 10
- we need the data in the Red component and also in the Green one
- the Green component is a child of the Blue component that is a child of the Red component
- so, most probably, we will need to send the data from the Red component to the Blue one just to be able to send it to the Green one

---
### Clearify the problem
In this point our code would look something like this:

```js
const Green = (props) => (
  <div className="green">{props.number}</div>
)
const Blue = (props) => (
  <div className="blue">
    <Green number={props.number} />
  </div>
)
 
class Red extends Component {
  state = { number : 10 }
  render() {
    return  <div className="red">
      {this.state.number}
      <Blue number={this.state.number} />
    </div>
  }
}
```
* Imagine what will happen if we have ten levels of parent-child React components

---
### The solution
State management with React Context
- allows to define data stores and access them where needed
- No need to have to pass down data through properties
- something like an “application global state” 

---
### How to use React Context ?
Four main steps to setup
1. setup a context provider and define the data 
```js
const AppContext = React.createContext()
```
2. build a context provider component
```js
class AppProvider extends Component {
    state = { number : 10, }
    render() {
        return <AppContext.Provider value={this.state}
        {this.props.children}
        ></AppContext.Provider>
    }
}
```
---
### How to use React Context ?
3. wrapping everything in this AppProvider 
```js
class Red extends Component {
  render() {
    return  <AppProvider> 
        <div className="red"><Blue /></div>
    </AppProvider>
  }
}
```
4. use a context consumer 
```js
<AppContext.Consumer>
      {(context) => context.number}
</AppContext.Consumer>
```

---
### Modifying data in Context
If you want to change the context data
- define a function on the state of the AppProvider context
- do the required updates onto the state data

```js
class AppProvider extends Component {
 state = {
    number : 10,
    inc: () => {
      this.setState({number: this.state.number + 1})
    }
  }
  //...
}
```

---
### Modifying data in Context
Now we can call it in a onClick event
```js
const Blue = () => (
  <div className="blue">
    <AppContext.Consumer>
        {(context) => <button onClick={context.inc}>INC</button>}
      </AppContext.Consumer>
    <Green />
  </div>
)
```

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using Context Api

---
### Flux
Flux is an architecture pattern.
It mainly consists of four components
- View
    - the user-visible layer which consists of React Components
- Action
    - things that happen in your app
    - a user clicking on the button is the event 
    - showing a pop-up message is the action
- Dispatcher
    - dispatches the action to the store
    - whenever a component invokes an action, the dispatcher will dispatch the action to all the registered stores
- Store
    - just an object extended from event emitter which acts as a data store
    - when state changes, the store emits events
    - Only the store itself can mutate its own data
    - registers itself with the dispatcher

---
### Flux Diagram
<img src="/images/flux.png" />

---
### Basic Flux Example
A Flux implementation usually consists of
- a constants file (uniquely identifiable names)
- an AppDispatcher
- a few action creators (really just objects)
- a store, which will keep track of the data
- a couple of UI components

---
### A Scenario
Suppose we have a bank application
- the bank manages accounts
- the bank manages withdrawals and deposits
- the bank holds the balance

From this scenario, let break this into code

---
### Constants
Lets define the constants

```js
const BankConstants = {
      CREATEACCOUNT:'CreateAccount',
      WITHDRAW:'WithDraw',
      DEPOSIT:'Deposit'
};
```

---
### Dispatcher
Create a dispatcher

```js
class AppDispatcher extends Flux.Dispatcher {
    dispatch(action = {}) {
        console.log("Dispatched", action);
        super.dispatch(action);
    }
}
let dispatcher = new AppDispatcher();
```

---
### Action Creators
And a couple of action objects to dispatch
```js
let BankActions = {
    createAccount(line, id) {
        dispatcher.dispatch({
            type: BankConstants.CREATEACCOUNT
        });
    },
    deposit(amount) {  
        dispatcher.dispatch({ 
            type: BankConstants.DEPOSIT, 
            amount: amount
        }); 
    },
    withDraw(amount) {  
        dispatcher.dispatch({ 
            type: BankConstants.WITHDRAW, 
            amount: amount
        }); 
    }
}
```


---
### Store
Create a Store to hold the state
```js
let __emitter = new EventEmitter();
let balance = 0;

let BankStore = {
        getState() {
            return balance;
        },
        addListener(callback) {
            return __emitter.addListener(CHANGE_EVENT, callback);
        }
    };
```

---
### Store
Register this store to listen to dispatches
```js
BankStore.dispatchToken = dispatcher.register((action) => {
    switch (action.type) {
    case BankConstants.CREATEACCOUNT:
        balance = 0;
        __emitter.emit(CHANGE_EVENT);
        break;
    case BankConstants.DEPOSIT:
        balance += parseInt(action.amount);
        __emitter.emit(CHANGE_EVENT);
        break;
    case BankConstants.WITHDRAW:
        balance -= parseInt(action.amount);
        __emitter.emit(CHANGE_EVENT);
        break;
    }});
```

---
### View
Create UI Components to use the store
```js
class Container extends React.Component {
    constructor(){
        super(); 
        this.state = { amount:0, balance: BankStore.getState()}
    }

    componentDidMount() {
        this.storeSubscription = BankStore.addListener(
          data => this.handleStoreChange (data)
        );
        BankActions.createAccount();
    }

    handleStoreChange(){
        this.setState({balance: BankStore.getState()});
    }

    handleChange(event){
        this.setState({amount:event.target.value});
    }

    render(){
        return (<div>
            { this.state.balance } { " " }
            Amount: <input type="text" value={this.state.amount}  onChange={this.handleChange.bind(this)} />
            <button onClick={() => BankActions.deposit(this.state.amount)}>Add cash</button>
            <button onClick={() => BankActions.withDraw(this.state.amount)}>Withdraw cash</button>
            </div>);
        
    }
  }
  ReactDOM.render(<Container />, document.querySelector("#root"));
``` 

---
<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Flux Demo


---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Adding Flux
