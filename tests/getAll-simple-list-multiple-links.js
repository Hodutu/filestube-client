'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

// getOne result with only one file
module.exports = {
  run: function(cb) {
    TESTHELPER({
      list: require('./mocks/list-one-page'),
      final: require('./mocks/final-multiple-links'),
      repetitions: 5,
      testedMethod: 'getll',
      options: {},
      assert: function(data) {
        assert.equal(data.length, 5);
        // every element is 1 element array
        data.forEach(function(element) {
          assert.equal(element.length, 1);
          assert.equal(
            element,
            'http://blablabla.jczc/files/w2q9vfcl/Zbych.Andrzej-Stawka.wieksza.niz'
          );
        });
      },
      cb: cb
    });
  }
};
