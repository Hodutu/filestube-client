'use strict';

var Nock = require('nock');
var nock = Nock('http://www.filestube.to');



var initMock = function(list, final) {
  nock.get('/query.html?q=stawka+wieksza+niz+zycie')
  .reply(200, list);

  nock.get('/details.html').once()
  .reply(200, final);
};

module.exports = initMock;
