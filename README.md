filestube-client
================

Draft of the api:

```
  getOne(phrase, options, cb);
  getMany(quantity, phrase, options, cb);
  getAll(phrase, options, cb);
  forEach(phrase,oprions, cb);

  cb(error, data){
    // data is an Array
  };
```
