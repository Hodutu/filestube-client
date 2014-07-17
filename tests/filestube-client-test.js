'use strict';

var FilestubeAPI = require('../index');

FilestubeAPI.getOne('Warsaw Photos', {}, function(data){
  console.log(data);
});
