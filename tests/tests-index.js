'use strict';

var tests = [
  require('./getOne-simple-list-single-link.js'),
  require('./getOne-simple-list-multiple-links.js')
];

var runTest = function(index) {
  var cb = function(){};
  if (index < tests.length) {
    cb = function() {
      index++;
      runTest(index);
    };
  }
  tests[index].run(cb);
};

runTest(0);
