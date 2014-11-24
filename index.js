'use strict';

var jsdom = require('jsdom');
var async = require('async');

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
	// Links
    pagination: '.pgr',
    result: '.r',
    resultsLink: '.rL',
    copyPasteLink: '#copy_paste_links',
    // Hosts
    searchHost: '.searchable',
    checkboxHost: '.hosting_checkbox',
    searchHostName: 'span'
  };

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
            // pagination paneles
            pages = d.querySelector(cssSelectors.pagination)
                     .querySelectorAll('a').length;

            // Current page is unclickable SPAN element, not a link, so we
            // need to increment final number of the pages
            pages++;

            // If we don't want to parse all the pages of results (for
            // instance - we are interested just in one result), then let's
            // limit number of pages
            pages = Math.min(maxPages, pages);
          } else {
            // If pagination panel is not present in the DOM three of the
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

  // This function gets links to the pages with final links, so all we have
  // passed to the callback from here are links to filestube.to pages we need
  // to parse then to get final links from them
  var getLinks = function(term, options, callback) {
    // Assign the callback to the `global` (in terms of the module scope in
    // here) so it can be accessed from anywhere inside the module
    mainCallback = callback;
    // Reset some variables
    pages = 0;
    currentPage = 1;
    totalUrls = [];
    url = 'http://www.filestube.to/query.html?q=';

    // change spaces to `+`
    term = term.replace(/\s/g, '+');

    // options support
    // XXX: Add SMART support for all of the options
    var reqOptions = '';

    if (options.type) {
      reqOptions += '&select=' + options.type;
    }

    if (options.size) {
      reqOptions += '&size=' + options.size;
    }
    
    if (options.hosts) {
    	var hosts = options.hosts;
    	if(hosts instanceof Array){
    		reqOptions += '&hosting=' + hosts[0];
    		for (var i = 1; i < hosts.length; i++) {
    			reqOptions += '%2C' + hosts[i];
    		}
    	} else {
    		reqOptions += '&hosting=' + hosts;
    	}
    }

    // Create proper URL to ask for the content
    url = url + term + reqOptions;
    // And parse it. Set handlePageParsingResults as callback
    parsePage(url, handlePageParsingResults);

  };

  // This function gets the filestube.to page and looks for a final, direct
  // link to the file we are interested in.
  var stripFinalLink = function(url, callback) {
    // Parse only when there is any URL (Sometimes there are strange results
    // when parsing main page and we can end up with url that doesn't exist)
    if (url) {
      jsdom.env({
        url: url,
        done: function(err, window) {
          var d = window.document;
          // If there is a textfield with links, pass them to callback
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
    // we are interested only in one link in this method so let's parse just
    // first page of the results
    maxPages = 1;
    var currentLink = 0;
    getLinks(phrase, options, function(links){
      stripFinalLink(links[currentLink], function stripFinal_cb(resultLink){
        // if there was an error (resultLink equal 0) but we still have more
        // links, parse moar of them!
        if (resultLink === 0 && links[currentLink]) {
          currentLink++;
          stripFinalLink(links[currentLink], stripFinal_cb);
        } else {
          // if we have proper links array
          if (resultLink !== 0) {
            // remove white chars at the end of the every line, make an array
            // from the string & remove empty elements.
            resultLink = resultLink.split('\r\n').filter(function(element){
              if (element !== '') {
                return element;
              }
            });
          }
          callback(resultLink);
        }
      });
    });
  };

  // Works similar to getOne but we parse all of the results for all of
  // the pages
  var getAll = function(phrase, options, callback){
    // restart some base variable
    maxPages = Infinity;
    getLinks(phrase, options, function(links){
      var finalLinks = [];
      // we need to use anysc forEach because stripFinalLink() is asynchronous
      async.forEach(links, function(singleLink, cb){
        stripFinalLink(singleLink, function stripFinal_cb(resultLink){
          if (resultLink !== 0) {
            finalLinks.push(resultLink.split('\r\n').filter(function(element) {
              if (element !== '') {
                return element;
              }
            }));
            // We call this callback here to let async.forEach() know that we
            // are done with this particular element and we want to grab the
            // next one.
            cb();
          }
        });
      }, function() { // this callback is called what all the elements are done
        callback(finalLinks);
      });
    });
  };
  

  // Get all available host
  var getAllHost = function(){
	  // The URL to get all available host filter.
	  var urlForHost = url+'gethost';
	  // Using jsdom we ask for the page on the given address.
	    jsdom.env({
	      url: urlForHost,
	      done: function(err, window) {
	        var d = window.document;
	        // This Array will store all the host and their key code.
	        var hosts = [];
	        
	        // Let's grab available host from the page...
	        var results = d.querySelectorAll(cssSelectors.searchHost);

	        // ... and iterate through them.
	        for (var i = 0, j = results.length; i< j; i++) {
	          var result = results[i];

	          // Find the host value
	          var hostValue = result.querySelector(cssSelectors.checkboxHost);
	          
	          // Find the hostname
	          var hostName = result.getElementsByTagName(cssSelectors.searchHostName);

	          // Add the host to the Array
	          if(hostValue != null){
	        	  var host = {};
	        	  host['key'] = hostValue.value;
	        	  host['name'] = hostName[0].innerHTML;
	        	  hosts.push(host);
	          }
	        }
	        return hosts;
	      }
	    });
  };

  return {
    getOne: getOne,
    getAll: getAll,
    getAllHost: getAllHost
  };
})();

module.exports = Filestube_API;
