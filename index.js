var jsdom = require('jsdom');

var Filestube_API = (function() {
  // query.html is the page where the browser pings with search query
  var url = 'http://www.filestube.to/query.html?q=';
  // How many pages of results this search query has?
  var pages = 0;
  // Number of the page that is currently proceeded
  var currentPage = 1;
  // How many pages are we intrerested in? If we want just one link (getOne) we
  // don't need all the pages, one will be enough. In other cases we try to get
  // as many as possible
  var maxPages = Infinity;

  // Array with all the URLs that will be returned to the callback. That's not
  // the most clever name for the variable but it's 5AM and I worked for 20h
  // today so don't expect me to behave rationally now.
  var totalUrls = [];

  // Callback that is called after all the computation is done
  var mainCallback = function(e) { console.log('Sum tink rong', e); };

  // Selectors (ids and classes) for the DOM element of filestube.to page.
  var cssSelectors = {
    pagintion: '.pgr',
    result: '.r',
    resultsLink: '.rL',
    copyPasteLink: '#copy_paste_links'
  }

  // This function parses the content of the main search page (the one with all
  // the search results)
  var parsePage = function(url, cb) {
    // Using jsdom we ask for the page on the given address.
    jsdom.env({
      url: url,
      done: function(err, window) {
        var d = window.document;
        // This Array will store all the urls we are interested in from
        // given site
        var urls = [];
        // If `pages` var is equal 0, than we've just started and we don't know
        // how many pages of results we have for our query
        if (pages === 0) {
          // If there is a pagination panel with page numbers, it means we have
          // more than 1 page of results
          if (d.querySelector(cssSelectors.pagination)) {
            // So let's calculate how many links (<a> elements) are in the
            // pagination panel
            pages = d.querySelector(cssSelectors.pagination).querySelectorAll('a').length;

            // If we don't want to parse all the pages of results (for
            // instance - we are interested just in one result), then let's
            // limit number of pages
            pages = Math.min(maxPages, pages);
          } else {
            // If pagination panel is not present in the ODM three of the
            // result page it means we have just one page of results
            pages = 1;
          }

        }

        // Code below will be executed for all the pages with results, not only
        // the first one (like the pagination code)

        // Let's grab all the results form the page...
        var results = d.querySelectorAll(cssSelectors.result);

        // ... and iterate through them.
        for (var i = 0, j = results.length; i< j; i++) {
          var result = results[i];
          // Find a link in the `result` DOM element
          var link = result.querySelector(cssSelectors.resultsLink).href;
          // Add the link to the Array
          urls.push(link);
        }
        // pass all the links to pages with results to the callback
        cb(urls);
      }
    });
  };

  // This function is responsible for checking if we have more pages to
  // download & parse or we should finish and fire main callback with results
  var handlePageParsingResults = function(urls) {
    // Add the url to those we already have
    totalUrls = totalUrls.concat(urls);
    // if we still have pages to handle
    if (currentPage < pages) {
      currentPage++;
      // Download & parse another page of results
      parsePage(url + '&page=' + currentPage, handlePageParsingResults);
    } else {
      // If not pass the Array of links to the main callback
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

Filestube_API.getAll('himym', {}, function(e){ console.log('o:', e)});
