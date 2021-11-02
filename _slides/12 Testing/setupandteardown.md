# Setup and Teardown

---
### Setup and Teardown
Often you have some setup work that needs to happen before tests run 

Often you have some finishing work that needs to happen after tests run

Jest provides helper functions to handle this

---
### Repeating Setup For Many Tests
If you have some work you need to do repeatedly for many tests
- beforeEach 
- afterEach


---
### Repeating Setup For Many Tests
For example, let's say that several tests interact with a database of cities
- initializeCityDatabase() must be called before each of these tests
- clearCityDatabase() must be called after each of these tests

```
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```


---
### async beforeEach and afterEach
beforeEach and afterEach can handle asynchronous code in the same ways that tests can handle asynchronous code 

They can either 
- take a done parameter 
- return a promise

---
### async beforeEach and afterEach
For example, if initializeCityDatabase() returned a promise that resolved when the database was initialized:

```
beforeEach(() => {
  return initializeCityDatabase();
});
```

---
### One-Time Setup
In some cases, you only need to do setup once, at the beginning of a file

Jest provides 
- beforeAll 
- afterAll 

---
### One-Time Setup
For example, if both initializeCityDatabase and clearCityDatabase returned promises, and the city database could be reused between tests:

```
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

---
### Scoping
By default, the before and after blocks apply to every test in a file
 
You can also group tests together using a describe block

When  inside a describe block, the before and after blocks only apply to the tests within that describe block

---
### Scoping
For example, let's say we had not just a city database, but also a food database. We could do different setup for different tests

```
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

Note that the top-level beforeEach is executed before the beforeEach inside the describe block

---
### General Advice
If a test is failing, one of the first things to check should be whether the test is failing when it's the only test that runs. 

To run only one test with Jest, temporarily change that test command to a test.only
```
test.only('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
```

---
### General Advice
If you have a test that often fails when it's run as part of a larger suite, but doesn't fail when you run it alone, it's a good bet that something from a different test is interfering with this one. 

You can often fix this by clearing some shared state with beforeEach. If you're not sure whether some shared state is being modified, you can also try a beforeEach that logs data.

<!-- .slide: data-background="url('images/demo.jpg')" data-background-size="cover" --> 
<!-- .slide: class="lab" -->
## Demo time!
Using setup and teardown

---
<!-- .slide: data-background="url('images/lab2.jpg')" data-background-size="cover"  --> 
<!-- .slide: class="lab" -->
## Lab time!
Using setup and teardown