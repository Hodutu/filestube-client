'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

// getOne result with only one file
module.exports = {
  run: function(cb) {
    TESTHELPER({
      list: require('./mocks/list-one-page'),
      final: require('./mocks/final-single-link'),
      repetitions: 5,
      testedMethod: 'getAll',
      options: {},
      assert: function(data) {
        assert.equal(data.length, 5);
        data.forEach(function(element){
          assert.equal(
            element[0],
            'http://blablabla.jczc/files/w2q9vfcl/'+
            'Zbych.Andrzej-Stawka.wieksza.niz'
          );
        });
      },
      cb: cb
    });
  }
};
