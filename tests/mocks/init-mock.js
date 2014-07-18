'use strict';

var nock = require('nock');

module.exports = function(list, final) {
  nock('http://www.filestube.to')
  .get('/query.html?q=stawka+wieksza+niz+zycie')
  .reply(200, list);

  nock('http://www.filestube.to')
  .get('/details.html')
  .reply(200, final);
};
