'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

module.exports = {
  run: function(cb) {
    TESTHELPER({
      list: require('./mocks/list-multiple-pages'),
      final: require('./mocks/final-multiple-links'),
      repetitions: 5 * 5, // links per page times pages
      pages: 5,
      testedMethod: 'getAll',
      options: {},
      assert: function(data) {
        assert.equal(data.length, 5 * 5);
        data.forEach(function(element) {
          assert.equal(element.length, 5);
          element.forEach(function(link){
            assert.equal(
              link,
              'http://blablabla.jczc/files/w2q9vfcl/'+
              'ZbychAndrzej-Stawka.wieksza.niz'
            )
          });
        });
      },
      cb: cb
    });
  }
};
