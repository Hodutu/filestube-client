'use strict';

// List of all the tests, filenames should be self explanatory
var tests = [
  require('./getOne-simple-list-single-link.js'),
  require('./getOne-simple-list-multiple-links.js'),

  require('./getAll-simple-list-single-link.js'),
  require('./getAll-simple-list-multiple-links.js'),

  require('./getAll-multipage-list-single-link.js'),
  require('./getAll-multipage-list-multiple-links.js')
];

// All the tests need to run synchronously, so I created this simple
// callback-driven function to iterate thru the array of tests & run
// the next one after previous have finished
var runTest = function(index) {
  var cb = function(){};
  if (index < tests.length-1) {
    cb = function() {
      index++;
      runTest(index);
    };
  }
  tests[index].run(cb);
};

runTest(0);
