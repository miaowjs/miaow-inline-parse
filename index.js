var async = require('async');
var mutil = require('miaow-util');

var pkg = require('./package.json');

/**
 * 解析主入口
 */
function parse(option, cb) {
  var keyword = option.keyword || 'inline';
  var reg = new RegExp('[\'"\\(](([\\w\\_\\/\\.\\-]*)\\?' + keyword + ')[\'\"\\)]', 'gi');
  var contents = this.contents.toString();
  var dataURIMap = {};

  var module = this;
  async.eachSeries(contents.match(reg) || [], function (relative, cb) {
    var result = reg.exec(relative);
    module.getModule(result[2], function (err, relativeModule) {
      if (err) {
        return cb(err);
      }

      // 添加依赖信息
      module.dependencies.push(relativeModule.srcPath);

      dataURIMap[result[1]] = mutil.getDataURI(relativeModule.destAbsPath);
      cb();
    });
  }, function (err) {
    if (err) {
      return cb(new mutil.PluginError(pkg.name, err, {
        fileName: this.file.path,
        showStack: true
      }));
    }

    contents = contents.replace(reg, function (str, key) {
      return str.replace(key, dataURIMap[key]);
    });

    module.contents = new Buffer(contents);

    cb();
  });
}

module.exports = parse;
