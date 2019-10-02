/* Problem: 

Given this set up:

var f1 = function () {
    console.log('f1');
};

var f2 = function (callback) {
    console.log('f2');
    callback();
};

var f3 = function (callback) {
    console.log('f3');
    callback();
};

Write functions to make it print f1 f2 f3 and f3 f2 f1 without error

*/

// Solution:

// Using callback
var f1 = function () {
  console.log('f1');
};

var f2 = function (callback) {
  console.log('f2');
  callback();
};

var f3 = function (callback) {
  console.log('f3');
  callback();
};

f3(() => {
  f2(() => {
    f1();
  })
}); // f3 f2 f1

f3(
  (() => {
    f2(
      (() => {
        f1();
        return () => {};
      })() 
    );
    return () => {};
  })()
);  // f1 f2 f3


