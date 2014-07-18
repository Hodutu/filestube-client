'use strict';

var FilestubeAPI = require('../index');
var initMock = require('./mocks/init-mock.js');

module.exports = function(options) {
  initMock(
    options.list,
    options.final
  );

  FilestubeAPI[options.testedMethod](
    'stawka wieksza niz zycie',
    options.options || {},
    options.assert
  );
};
