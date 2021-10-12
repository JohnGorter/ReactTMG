# Flux


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