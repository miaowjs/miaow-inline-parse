var assert = require('assert');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');
describe('正常模式', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/normal'),
      output: path.resolve(__dirname, './output'),
      mini: false,
      lint: false,
      pack: false,
      module: {
        parse: [
          {
            test: /\.(js|css)$/,
            plugins: [parse]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = require('./output/miaow.log.json');
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中嵌入图片', function () {
    assert.equal(log.modules['foo.css'].hash, '3266cac92f053d7bb402f85d2e37f3c6');
  });

  it('脚本中嵌入样式', function () {
    assert.equal(log.modules['foo.js'].hash, 'ff88ed763a70a3f4e2ef71b6d971f7ac');
  });
});

describe('更换关键字', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/keyword'),
      output: path.resolve(__dirname, './output'),
      mini: false,
      lint: false,
      pack: false,
      module: {
        parse: [
          {
            test: /\.(js|css)$/,
            plugins: [{
              plugin: parse,
              option: {
                keyword: 'dataURI'
              }
            }]
          }
        ]
      }
    }, function (err) {
      if (err) {
        console.error(err.toString());
        process.exit(1);
      }
      log = require('./output/miaow.log.json');
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('样式中嵌入图片', function () {
    assert.equal(log.modules['foo.css'].hash, '3266cac92f053d7bb402f85d2e37f3c6');
  });

  it('脚本中嵌入样式', function () {
    assert.equal(log.modules['foo.js'].hash, 'ff88ed763a70a3f4e2ef71b6d971f7ac');
  });
});
