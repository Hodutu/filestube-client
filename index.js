var jsdom = require('jsdom');

var Filestube_API = (function() {
  var url = 'http://www.filestube.to/query.html?q=';
  var pages = 0;
  var currentPage = 1;
  var maxPages = 2;//Infinity;

  var totalUrls = [];
  var mainCallback = function(e) { console.log('Sum tink rong', e); };

  var parsePage = function(url, cb) {
    jsdom.env({
      url: url,
      done: function(err, window) {
        var d = window.document;
        var urls = [];
        if (pages === 0) {
          if (d.querySelector('.pgr')) {
            pages = d.querySelector('.pgr').querySelectorAll('a').length;
            pages = Math.min(maxPages, pages);
            console.log('Number of pages:', pages);
          } else {
            pages = 1;
          }

        }

        var results = d.querySelectorAll('.r');

        for (var i = 0, j = results.length; i< j; i++) {
          var result = results[i];
          //console.log(result.querySelector('.resultDescription').textContent);

          var hasMoreParts;
          try {
            hasMoreParts = (
              result.textContent.indexOf('parts') > -1
            );
          } catch (e) {
            hasMoreParts = true;
          }

          var properEpisode = true;

          try {
            if (!hasMoreParts && properEpisode) {
              var link = result.querySelector('.rL').href;
              link = 'http://www.filestube.to/' + link.split('/').pop();
              urls.push(link);
              console.log('OK!', link);
            }
          } catch (e) {
            console.log('ERROR: ', e);
          }

        }

        cb(urls);
      }
    });
  };

  var handlePageParsingResults = function(urls) {
    totalUrls = totalUrls.concat(urls);
    if (currentPage < pages) {
      currentPage++;
      parsePage(url + '&page=' + currentPage, handlePageParsingResults);
    } else {
      mainCallback(totalUrls);
    }
  };

  var getLinks = function(term, options, callback) {
    mainCallback = callback;
    pages = 0;
    currentPage = 1;
    url = 'http://www.filestube.to/query.html?q=';
    totalUrls = [];
    term = term.replace(/\s/g, '+');
    var reqOptions = '';

    if (options.type) {
      reqOptions = '&select=' + options.type;
    }

    url = url + term + reqOptions;
    console.log('Starting link:', url);

    parsePage(url, handlePageParsingResults);

  };

  var stripFinalLink = function(url, callback) {
    console.log('Link proceeded: ', url);
    if (url) {
      jsdom.env({
        url: url,
        done: function(err, window) {
          var d = window.document;
          if (d.querySelector('#copy_paste_links')) {
            callback(d.querySelector('#copy_paste_links').textContent);
          } else {
            callback(false);
          }
        }
      });
    } else {
      callback(false);
    }
  };

  var getOne = function(){};

  return {
    getLinks: getLinks,
    stripFinalLink: stripFinalLink,
    getOne: getOne
  };
})();

module.exports = Filestube_API;

Filestube_API.getLinks("Czterej Pancerni i pies", {}, function(e){ console.log('o: ', e);});
