'use strict';

var FilestubeAPI = require('../index');
var assert = require('assert');
var nock = require('nock');

var initMock = function(list, final) {
  nock('http://www.filestube.to')
  .get('/query.html?q=stawka+wieksza+niz+zycie')
  .reply(200, list);

  nock('http://www.filestube.to')
  .get('/details.html')
  .reply(200, final);
};

//var elementsOnPage = 5;

// getOne result with only one file
initMock(
  require('./mocks/list-one-page'),
  require('./mocks/final-single-link')
);
FilestubeAPI.getOne('stawka wieksza niz zycie', {}, function(data){
  assert.equal(data.length, 1);
  assert.equal(
    data[0],
    'http://blablablabla.jczc/files/w2q9vfcl/Zbych.Andrzej-Stawka.wieksza.niz'
  );
});

// getOne result with multiple files
// initMock(
//   require('./mocks/list-one-page'),
//   require('./mocks/final-multiple-links')
// );
// FilestubeAPI.getOne('stawka wieksza niz zycie', {}, function(data){
//   assert.equal(data.length, 5);
// });
