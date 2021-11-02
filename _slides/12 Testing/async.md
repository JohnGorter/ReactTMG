# Testing Asynchronous Code

---
### Testing Asynchronous Code
It's common in JavaScript for code to run asynchronously

Jest has several ways to handle this.

---
### Callbacks
The most common asynchronous pattern is callbacks

For example, let's say that you have a fetchData(callback) function that fetches some data and calls callback(data) when it is complete

You want to test that this returned data is the string 'peanut butter'.

---
### Callbacks
By default, Jest tests complete once they reach the end of their execution. That means this test will not work as intended

```
// Don't do this!
test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
```

The problem is that the test will complete as soon as fetchData completes, before ever calling the callback

---
### Callbacks
Instead of putting the test in a function with an empty argument, use a single argument called done

Jest will wait until the done callback is called before finishing the test

```
test('the data is peanut butter', done => {
  function callback(data) {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});
```

If done() is never called, the test will fail (with timeout error), which is what you want to happen


---
### Promises
If your code uses promises, there is a more straightforward way to handle asynchronous tests

Return a promise from your test, and Jest will wait for that promise to resolve\

---
### Promises, example
For example, let's say that fetchData, instead of using a callback, returns a promise that is supposed to resolve to the string 'peanut butter'. We could test it with:

```
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

Be sure to return the promise!

---
### Promises, example

If you expect a promise to be rejected, use the .catch method
```
test('the fetch fails with an error', () => {
  expect.assertions(1);
  return fetchData().catch(e => expect(e).toMatch('error'));
});
```

---
### .resolves / .rejects
You can also use the .resolves matcher in your expect statement, and Jest will wait for that promise to resolve
 
If the promise is rejected, the test will automatically fail.

```
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

---
### .resolves / .rejects
If you expect a promise to be rejected, use the .rejects matcher. It works analogically to the .resolves matcher. If the promise is fulfilled, the test will automatically fail.

```
test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});
```

---
### Async/Await
Alternatively, you can use async and await in your tests

```
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using async

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using async