// import update from 'react-addons-update';
import update from 'immutability-helper';

// without helper
const test1 = ['x'];
const test2 = test1;
test2.push('y'); // ['x', 'y']


// with helper

const state1 = ['x'];
const state2 = update(state1, {$push: ['y']}); // ['x', 'y'];


debugger;



const myData = { a: { b:[] },  x: { y: { z: 6 }}};
const newData = update(myData, {
    x: {y: {z: {$set: 7}}},
    a: {b: {$push: [9]}}
  });

console.log("newData", newData);
  debugger;


const obj = {a: 5, b: 3};
const newObj = update(obj, {b: {$apply: function(x) {return x * 2;}}});
// => {a: 5, b: 6}
// This is equivalent, but gets verbose for deeply nested collections:
const newObj2 = update(obj, {b: {$set: obj.b * 2}});

console.log("newObj2", newObj2);
debugger;
