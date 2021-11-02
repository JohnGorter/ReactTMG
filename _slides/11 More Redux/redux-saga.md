# Redux-Saga

---
### Redux-Saga
Sagas are implemented using Generator functions
 
To express the Saga logic, yield plain JavaScript Objects from the Generator
- these are called Objects Effects

An Effect is an object that contains information to be interpreted by the middleware

> You can view Effects like instructions to the middleware to perform some operation


---
### Redux-Saga
To create Effects, you use the functions provided by the library in the redux-saga/effects package

Sagas can yield Effects in multiple forms
- the easiest way is to yield a Promise

---
### Redux-Saga, example
Suppose we have a Saga that watches a PRODUCTS_REQUESTED action
- on each matching action, start a task to fetch a list of products from a server

```
import { takeEvery } from 'redux-saga/effects'
import Api from './path/to/api'

function* watchFetchProducts() {
  yield takeEvery('PRODUCTS_REQUESTED', fetchProducts)
}

function* fetchProducts() {
  const products = yield Api.fetch('/products')
  console.log(products)
}
```

---
### Redux-Saga, example

The Api.fetch('/products') triggers an AJAX request and returns a Promise that will resolve with the resolved response, the AJAX request will be executed immediately

Suppose we want to test the generator above:
```
const iterator = fetchProducts()
assert.deepEqual(iterator.next().value, ??) // what do we expect ?
```

We want to check the result of the first value yielded by the generator. In our case it's the result of running Api.fetch('/products') which is a Promise 


---
### Redux-Saga, example
Instead of invoking the asynchronous function directly from inside the Generator
- yield only a description of the function invocation
- i.e. yield an object which looks like

```
// Effect -> call the function Api.fetch with `./products` as argument
{
  CALL: {
    fn: Api.fetch,
    args: ['./products']
  }
}
```

---
### Redux-Saga, example
The Generator will yield plain Objects containing instructions, and the redux-saga middleware will take care of executing those instructions and giving back the result of their execution to the Generator

This way, when testing the Generator, all we need to do is to check that it yields the expected instruction by doing a simple deepEqual on the yielded Object.

For this reason, the library provides a different way to perform asynchronous calls.
```
import { call } from 'redux-saga/effects'

function* fetchProducts() {
  const products = yield call(Api.fetch, '/products')
  // ...
}
```
We're using now the call(fn, ...args) function

---
### Redux-Saga, example

The difference from the preceding example is that now we're not executing the fetch call immediately, instead, call creates a description of the effect. Just as in Redux you use action creators to create a plain object describing the action that will get executed by the Store, call creates a plain object describing the function call. The redux-saga middleware takes care of executing the function call and resuming the generator with the resolved response.

This allows us to easily test the Generator outside the Redux environment. Because call is just a function which returns a plain Object.
```
import { call } from 'redux-saga/effects'
import Api from '...'

const iterator = fetchProducts()

// expects a call instruction
assert.deepEqual(
  iterator.next().value,
  call(Api.fetch, '/products'),
  "fetchProducts should yield an Effect call(Api.fetch, './products')"
)
```
Now we don't need to mock anything, and a basic equality test will suffice.

The advantage of those declarative calls is that we can test all the logic inside a Saga by iterating over the Generator and doing a deepEqual test on the values yielded successively. This is a real benefit, as your complex asynchronous operations are no longer black boxes, and you can test in detail their operational logic no matter how complex it is.

call also supports invoking object methods, you can provide a this context to the invoked functions using the following form:

yield call([obj, obj.method], arg1, arg2, ...) // as if we did obj.method(arg1, arg2 ...)
apply is an alias for the method invocation form

yield apply(obj, obj.method, [arg1, arg2, ...])
call and apply are well suited for functions that return Promise results. Another function cps can be used to handle Node style functions (e.g. fn(...args, callback) where callback is of the form (error, result) => ()). cps stands for Continuation Passing Style.

For example:
```
import { cps } from 'redux-saga/effects'

const content = yield cps(readFile, '/path/to/file')
And of course you can test it just like you test call:
```
import { cps } from 'redux-saga/effects'

const iterator = fetchSaga()
assert.deepEqual(iterator.next().value, cps(readFile, '/path/to/file') )
```
cps also supports the same method invocation form as call.
