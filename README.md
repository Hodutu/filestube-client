# filestube-client by [@michalbe](http://github.com/michalbe) #
Scraper for the file search engine - filestube.to

### What? ###
Filestube-client is a simple scraper for [filestube.to](http://filestube.to), biggest file search engine in the web.

### Why? ###
* __Question:__ Why do we need Filestube.to scraper? They have their own API!
* __Answer:__ Of course, but it's limited to 10000 requests a day, you need to register to use it, it doesn't fit all the use cases you can have, and it doesn't work time to time - actually I started to work on the scraper when the public API was down for almost a week.

### API: ###

Filestube-client has only two methods:

* __getOne(search-term, options, callback)__:

returns array of the links. The Array contains as many elements as many parts the file we were looking for is divided into.

* __getAll(search-term, options, callback)__:

returns array of arrays the links. It parses all the search results returned by filestube.to & creates and array for every one of them. This Array contains as many elements as many parts the file we were looking for is divided into. It is useful if you want to do something with those links afterwards, like trying to download them etc. Sometimes file is removed from the servers of the hosting services, but it's reference is still visible in the filestube site. It's easier then to grab all of the links and handle them on your own way.

__Available options:__
So far filestube-client allows you to specify:
  * The __type__ of the file (it's not the same thing as 'extension' in their service). It needs to be one of those:
     * `mkv`
     * `avi`
     * `mp3`
     * `mpeg`
     * `mpg`
     * `rar`
     * `wma`
     * `wmv`
     * `zip`
     * `rmvb`
     * `mp4`
     * `3pg`
     * `flv`
     * `torrent`
  * __size__ - needs to be one of those:
    * `1` - less than 20MB
    * `2` - between 20MB and 200MB
    * `3` - between 200MB and 1GB
    * `4` - bigger than 1GB

### How to use: ###
```
npm install filestube-client
```
then:
```javascript
var filestube = require('filestube-client');

// to grab just one file
filestube.getOne("Stawka wieksza niz zycie", {type: "mkv"}, function(link) {
  console.log(link);
  //['http://yoelo.jczc.hwdp/3rtk7q1qv87a']
});

// to grab all the files
filestube.getAll("Stawka wieksza niz zycie", {type: "mkv"}, function(links) {
  console.log(links);

  // [
      // If the file contains more tha one part, the Array
      // contains more elements
  //   [ 'http://yoelo.jczc.hwdp/3rtk7q1qv87a.part1',
  //     'http://yoelo.jczc.hwdp/3rtk7q1qv87a.part2'
  //   ],
  //   [ 'http://yoelo.jczc.hwdp/t92s9ocbxxiu' ],
  //   [ 'http://yoelo.jczc.hwdp/1p1vn4z4tywt' ],
  //   [ 'http://yoelo.jczc.hwdp/2pv7itp15bro' ],
  //   [ 'http://yoelo.jczc.hwdp/1hp502a4azc3' ],
  //   [ 'http://yoelo.jczc.hwdp/i61g6rdtjzsx' ],
  //   [ 'http://yoelo.jczc.hwdp/uegqx6j6ksh0' ],
  //   [ 'http://yoelo.jczc.hwdp/gvtrzlv9nadv' ],
  //   [ 'http://yoelo.jczc.hwdp/stxsc5spt21z' ],
  //   [ 'http://yoelo.jczc.hwdp/eaz48aa6psbn' ],
  //   [ 'http://yoelo.jczc.hwdp/rexpk547h0em' ],
  //   [ 'http://yoelo.jczc.hwdp/03l1d169voq0' ]
  // ]
});
```

### To Do ###
Support of:
* support of all the options provided by Filestube in a smart way (I'm not sure for now what `smart` means in this case :smile:):
  * `size`
  * `extension`
  * `hosting`
  * `type`
  * `date`


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
You can read more about tests in [tests/README.md](tests/README.md)
