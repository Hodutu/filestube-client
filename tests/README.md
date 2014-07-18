# filestube-client by [@michalbe](http://github.com/michalbe) #

## Tests ##
Because at the beginning I had hard times with configuration of the tests - I didn't want them to ping real servers on every time and use mocks instead, and even if [nock](https://github.com/pgte/nock) is a wonderful tool for this, it was hard to force it to serve exactly what I wanted - I've created quite simple system of `mocks` & `helpers`.

### Mocks ###
Mocks (located in `mocks/` directory) are parts of the DOM with needed by the filestube-client to scrape data from. Mocks for the main search page with list of all the results (called `query.html` in real, online version of fielstube.to) could be find in files with names started with `list-``. This is how simple list looks like:

```javascript
'use strict';

module.exports =
  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>' +

  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>' +

  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>';
```
It has 3 divs with links to the detailed pages. Other type of the list we need to test is a list with more than one page. `list-multiple-pages.js` contains this pagination footer as well:
```javascript
'use strict';

module.exports =
  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>' +

  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>' +

  '<div class="r">' +
    '<a href="http://www.filestube.to/details.html" class="rL">' +
      'Zbych Andrzej - Stawka wieksza niz zycie Cz 17 Akcja Lisc Debu' +
    '</a>' +
  '</div>' +

// pagination:

  '<div id="pager" class="pgr">' +
    '<span>1</span>' +
    '<a>2</a>' +
    '<a>3</a>' +
    '<a>4</a>' +
    '<a>5</a>' +
  '</div>';

```
Details pages (called with names of the files on the real, online version of filestube.to) look similar. Page where our file contains only one link (`final-single-link.js`):
```javascript
'use script';

// Final file with one single link
module.exports =
  '<span id="copy_paste_links">' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz' +
  '</span>';
```
And file that contains multiple parts (multiple links) - `final-multiple-links.js`:
```javascript
'use script';

// Final file with one single link
module.exports =
  '<span id="copy_paste_links">' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz\r\n' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz\r\n' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz\r\n' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz\r\n' +
    'http://blablabla.jczc/files/w2q9vfcl/ZbychAndrzej-Stawka.wieksza.niz\r\n' +
  '</span>';
```
This is all the DOM we need to test filestube-client. Mocks are managed by a module called `initMock` localized in `init-mock.js`. In this module you can specify how the fake server should answer to our requests.
```
initMock(
  list, // HTML Mock of the DOM structure of the main search page
  final, // HTML Mock of the DOM structure of the details page
  repetitions, // How many times `details` page will be displayed
  pages // How many pages we want to support
);
```

### Helpers ###
You don't need to understand what is going on in initMock, because of the helper located in `helper.js`. To create a new test you just need to create a new file and pass `options` object to the helper. This object describes how the test will behave:
``` javascript
'use strict';

var TESTHELPER = require('./helper');
var assert = require('assert');

module.exports = {
  run: function(cb) { // run() method is ran every the test started
    TESTHELPER({
      // Mock for query page DOM structure
      list: require('./mocks/list-multiple-pages'),
      // Mock for details page DOM structure
      final: require('./mocks/final-single-link'),
      // How many times fake server should answer with detail mock?
      repetitions: 5 * 5, // links per page times pages
      // How many pages it should create
      pages: 5,
      // which method of the Filestube_API object you want to test
      testedMethod: 'getAll',
      // Do you want to pass any additional options?
      options: {},
      // Those assertions need to pass, it's most important part of our test
      assert: function(data) {
        assert.equal(data.length, 5 * 5);
        data.forEach(function(element){
          assert.equal(element.length, 1);
          assert.equal(
            element[0],
            'http://blablabla.jczc/files/w2q9vfcl/'+
            'ZbychAndrzej-Stawka.wieksza.niz'
          );
        });
      },
      cb: cb
    });
  }
};
```

### Running tests ###
To run the test you need to add it to the `tests` array in `tests-index.js`:
```javascript
// List of all the tests, filenames should be self explanatory
var tests = [
  require('./getOne-simple-list-single-link.js'),
  require('./getOne-simple-list-multiple-links.js'),

  require('./getAll-simple-list-single-link.js'),
  require('./getAll-simple-list-multiple-links.js'),

  require('./getAll-multipage-list-single-link.js'),
  require('./getAll-multipage-list-multiple-links.js')
];
```
Then, to run all the tests:
```bash
npm tests
```
