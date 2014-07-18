'use strict';

var nock = require('nock');

var initMock = function(list, final, repetitions) {
  console.log('repetitions: ', repetitions);
  repetitions = repetitions || 1;
  console.log('repetitions: ', repetitions);
  nock('http://www.filestube.to')
  .get('/query.html?q=stawka+wieksza+niz+zycie')
  .reply(200, list);

  nock('http://www.filestube.to')
  .get('/details.html')
  .times(repetitions)
  .reply(200, final);
};

module.exports = initMock;
