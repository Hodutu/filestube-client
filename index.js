var jsdom = require('jsdom');

var Filestube_API = (function() {
  var url = 'http://www.filestube.to/query.html?q=';
  var pages = 0;
  var currentPage = 1;
  var maxPages = Infinity;

  var totalUrls = [];
  var mainCallback = function(e) { console.log('Sum tink rong', e); };

  var cssSelectors = {
    pagintion: '.pgr',
    result: '.r',
    resultsLink: '.rL',
    copyPasteLink: '#copy_paste_links'
  }
  var parsePage = function(url, cb) {
    jsdom.env({
      url: url,
      done: function(err, window) {
        var d = window.document;
        var urls = [];
        if (pages === 0) {
          if (d.querySelector(cssSelectors.pagination)) {
            pages = d.querySelector(cssSelectors.pagination).querySelectorAll('a').length;
            pages = Math.min(maxPages, pages);
          } else {
            pages = 1;
          }

        }

        var results = d.querySelectorAll(cssSelectors.result);

        for (var i = 0, j = results.length; i< j; i++) {
          var result = results[i];
          var link = result.querySelector(cssSelectors.resultsLink).href;
          link = 'http://www.filestube.to/' + link.split('/').pop();
          urls.push(link);

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
      reqOptions += '&select=' + options.type;
    }

    if (options.size) {
      reqOptions += '&size=' + options.size;
    }

    url = url + term + reqOptions;
    parsePage(url, handlePageParsingResults);

  };

  var stripFinalLink = function(url, callback) {
    if (url) {
      jsdom.env({
        url: url,
        done: function(err, window) {
          var d = window.document;
          if (d.querySelector(cssSelectors.copyPasteLink)) {
            callback(d.querySelector(cssSelectors.copyPasteLink).textContent);
          } else {
            callback(0);
          }
        }
      });
    } else {
      callback(0);
    }
  };

  var getOne = function(phrase, options, callback){
    maxPages = 1;
    var currentLink = 0;
    getLinks(phrase, options, function(links){
      stripFinalLink(links[currentLink], function stripFinal_cb(resultLink){
        if (resultLink === 0 && links[currentLink]) {
          currentLink++;
          stripFinalLink(links[currentLink], stripFinal_cb);
        } else {
          if (resultLink !== 0) {
            resultLink = resultLink.split('\r\n').filter(function(element){
              if (element !== '')
                return element;
            });
          }
          callback(resultLink);
        }
      });
    });
  };

  var getAll = function(phrase, options, callback){
    var links = [];
    getLinks(phrase, options, function(links){
      links.forEach(function(singleLink){
        stripFinalLink(singleLink, function stripFinal_cb(resultLink){
          if (resultLink !== 0) {
            callback(resultLink.split('\r\n').filter(function(element) {
              if (element !== '')
                return element;
            }));
          }
        });
      });
    });
  };

  return {
    getOne: getOne,
    getAll: getAll
  };
})();

module.exports = Filestube_API;

Filestube_API.getOne("grand theft auto 5", {}, function(e){ console.log('o: ', e);});
