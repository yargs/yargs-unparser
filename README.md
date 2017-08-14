# yargs-unparser

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/yargs-unparser
[npm-image]:http://img.shields.io/npm/v/yargs-unparser.svg
[downloads-image]:http://img.shields.io/npm/dm/yargs-unparser.svg
[travis-url]:https://travis-ci.org/moxystudio/yargs-unparser
[travis-image]:http://img.shields.io/travis/moxystudio/yargs-unparser/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/yargs-unparser
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/yargs-unparser/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/yargs-unparser
[david-dm-image]:https://img.shields.io/david/moxystudio/yargs-unparser.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/yargs-unparser?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/yargs-unparser.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/yargs-unparser.svg
[greenkeeper-url]:https://greenkeeper.io

Converts back a `yargs` argv object to its original array form.

Probably the unparser word doesn't even exist, but it sounds nice and goes well with [yargs-parser](https://github.com/yargs/yargs-parser).


## Installation

`$ npm install yargs-unparser --save`


## Usage

```js
const unparse = require('yargs-unparser');
const parse = require('yargs-parse');

unparse(parse(['node', 'cli.js', '--no-boolean', '--number', '4', '--string', 'foo'], {
    number: 'number',
    string: 'string',
    boolean: 'boolean',
}));
// ['node', 'cli.js', '--no-boolean', '--number', '4', '--string', 'foo']);
```

The second argument of `unparse` accepts an options object:

- `aliases`: The [aliases](https://github.com/yargs/yargs-parser#requireyargs-parserargs-opts) so that duplicate options aren't generated


**NOTE**: The returned array can be parsed again by `yargs-parser` using the default configuration. If you used custom configuration that you want `yargs-unparser` to be aware, please fill an [issue](https://github.com/moxystudio/yargs-unparser/issues).


## Tests

`$ npm test`   
`$ npm test:watch` during development


## License

[MIT License](http://opensource.org/licenses/MIT)
