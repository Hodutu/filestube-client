'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

// getOne result with multiple files
module.exports = {
  run: function(cb){
    TESTHELPER({
      list: require('./mocks/list-one-page'),
      final: require('./mocks/final-multiple-links'),
      testedMethod: 'getOne',
      options: {},
      assert: function(data){
        assert.equal(data.length, 5);
      },
      cb: cb
    });
  }
};
