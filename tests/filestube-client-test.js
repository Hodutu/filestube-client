'use strict';

var FilestubeAPI = require('../index');
var assert = require('assert');
var nock = require('nock');

var list;
var final;

var initMock = function(list, final){
  nock('http://www.filestube.to')
  .get('/query.html?q=stawka+wieksza+niz+zycie')
  .reply(200, list)
  .get('/details.html')
  .reply(200, final)
  .persist();
};

var teardown = function(){
  nock.restore();
};

var elementsOnPage = 5;

// getOne result with only one file
list = require('./mocks/list-one-page.js');
final = require('./mocks/final-single-link');
initMock(list, final);
FilestubeAPI.getOne('stawka wieksza niz zycie', {}, function(data){
  assert.equal(data.length, 1);
  assert.equal(
    data[0],
    'http://blablablabla.jczc/files/w2q9vfcl/Zbych.Andrzej-Stawka.wieksza.niz'
  );

  teardown();
});

// // getOne result with only one file
// list = require('./mocks/list-one-page.js');
// final = require('./mocks/final-multiple-links')
// initMock(require(list, final);
// FilestubeAPI.getOne('stawka wieksza niz zycie', {}, function(data){
//   assert.equal(data[0], 'http://blablablabla.jczc/files/w2q9vfcl/Zbych.Andrzej-Stawka.wieksza.niz');
// });
// teardown();
