# filestube-client by [@michalbe](http://github.com/michalbe) #
Scraper for the file search engine - filestube.to

### What? ###
Filestube-client is a simple scraper for [filestube.to](http://filestube.to), biggest file search engine in the web.

### Why? ###
* __Question:__ Why do we need Filestube.to scraper? They have their own API!
* __Answer:__ Of course, but it's limited to 10000 requests a day, you need to register to use it, it doesn't fit all the use cases you can have, and it doesn't work time to time - actually I started to work on the scraper when the public API was down for almost a week.


### How to use: ###
```
npm install filestube-client
```

then:
```javascript
var filestube = require('filestube-client');


filestube.getOne("Stawka wieksza niz zycie", {type: "mkv"}, function(link) {
  console.log(link);
  //['http://yoelo.jczc.hwdp/3rtk7q1qv87a.html?ps=9371']
});
```

### To Do ###
Support of:
* support of all the options provided by Filestube:
  * size
  * extension
  * hosting
  * type
  * date


### Testing ###
If you are interested in contributing:

```bash
#clone the repo
$ git clone git@github.com:michalbe/filestube-client.git
$ cd filestube-client

#install all the dependencies
$ npm install

#to run jshint:
$ npm run lint

#to run tests
$ npm test
```

Tests & linter are hooked to commit (using [precommit-hook](https://github.com/nlf/precommit-hook)), so you cannot commit if linter is not passing or there are failing tests. If you need to do that anyway:
```bash
$ git commit -n
```
To mock the request connection I used [Nock](https://github.com/pgte/nock). Together with the templates & helpers prepared in `/tests/mocks/` it's possible to manipulate fake wikipedia API responses to fit requirements of the given test.
