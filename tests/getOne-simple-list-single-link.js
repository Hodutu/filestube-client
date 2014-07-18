'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

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
          'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz'
        );
      },
      cb: cb
    });
  }
};
