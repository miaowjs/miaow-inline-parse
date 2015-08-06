var assert = require('assert');
var fs = require('fs');
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
      pack: false,
      module: {
        tasks: [
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
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
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

  it('添加依赖信息', function () {
    assert.equal(log.modules['foo.css'].dependList[0], 'foo.png');
    assert.equal(log.modules['foo.js'].dependList[0], 'foo.css');
  });
});

describe('更换关键字', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/keyword'),
      output: path.resolve(__dirname, './output'),
      pack: false,
      module: {
        tasks: [
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
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
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

describe('嵌入内容', function () {
  this.timeout(10e3);

  var log;

  before(function (done) {
    miaow.compile({
      cwd: path.resolve(__dirname, './fixtures/content'),
      output: path.resolve(__dirname, './output'),
      pack: false,
      module: {
        tasks: [
          {
            test: /\.(html|js)$/,
            plugins: [{
              plugin: parse,
              option: {
                reg: /(inline\s*\(\s*['"]([\w\_\/\.\-]+)['"]\s*\)\s*;?)/g,
                type: 'content'
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
      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function () {
    assert(!!parse);
  });

  it('页面中嵌入脚本', function () {
    assert.equal(log.modules['foo.html'].hash, 'f0e39dc5524af9f9235b9722a22e48a0');
  });

  it('脚本中嵌入脚本', function () {
    assert.equal(log.modules['foo.js'].hash, '6361430e1a72287ad57ddc930fc09d4a');
  });
});
