'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

// getOne result with only one file
module.exports = {
  run: function(cb) {
    TESTHELPER({
      list: require('./mocks/list-one-page'),
      final: require('./mocks/final-single-link'),
      testedMethod: 'getOne',
      options: {},
      assert: function(data){
        assert.equal(data.length, 1);
        assert.equal(
          data[0],
          'http://blablabla.jczc/file/w2q9vfcl/Zbych.Andrzej-Stawka.wieksza.niz'
        );
      },
      cb: cb
    });
  }
};
