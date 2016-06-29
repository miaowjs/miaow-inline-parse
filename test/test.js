var assert = require('assert');
var find = require('lodash.find');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var parse = require('../index');

function doCompile(context, done) {
  miaow({
    context: context
  }, function(err) {
    if (err) {
      console.error(err.toString(), err.stack);
      process.exit(1);
    }

    done(null, JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json'))));
  });
}

describe('正常模式', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/normal'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中嵌入图片', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).destHash, '3266cac92f053d7bb402f85d2e37f3c6');
  });

  it('脚本中嵌入样式', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, 'ff88ed763a70a3f4e2ef71b6d971f7ac');
  });

  it('添加依赖信息', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).dependencies[0], 'foo.png');
    assert.equal(find(log.modules, {src: 'foo.js'}).dependencies[0], 'foo.css');
  });
});

describe('更换关键字', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/keyword'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中嵌入图片', function() {
    assert.equal(find(log.modules, {src: 'foo.css'}).destHash, '3266cac92f053d7bb402f85d2e37f3c6');
  });

  it('脚本中嵌入样式', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, 'ff88ed763a70a3f4e2ef71b6d971f7ac');
  });
});

describe('嵌入内容', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    doCompile(path.resolve(__dirname, './fixtures/content'), function(err, _log) {
      log = _log;
      done(err);
    });
  });

  it('接口是否存在', function() {
    assert(!!parse);
  });

  it('样式中嵌入图片', function() {
    assert.equal(find(log.modules, {src: 'foo.html'}).destHash, '75d7f2f1be685213bef10187f40b40cb');
  });

  it('脚本中嵌入样式', function() {
    assert.equal(find(log.modules, {src: 'foo.js'}).destHash, '6361430e1a72287ad57ddc930fc09d4a');
  });
});
