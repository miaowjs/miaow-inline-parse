var async = require('async');
var mutil = require('miaow-util');

var pkg = require('./package.json');

/**
 * 解析主入口
 */
function parse(option, cb) {
  var keyword = option.keyword || 'inline';
  var reg = option.regexp || new RegExp('[\'"\\(](([\\w\\_\\/\\.\\-]*)\\#' + keyword + ')[\'\"\\)]', 'gi');
  var type = option.type || 'data-uri';
  var contents = this.contents.toString();
  var inlineMap = {};

  var module = this;
  async.eachSeries(contents.match(reg) || [], function (relative, cb) {
    var result = reg.exec(relative);
    module.getModule(result[2], function (err, relativeModule) {
      if (err) {
        return cb(err);
      }

      if (type === 'data-uri') {
        inlineMap[result[1]] = mutil.getDataURI(relativeModule.destAbsPath);
      } else if (type === 'content') {
        inlineMap[result[1]] = relativeModule.contents.toString();
      }

      cb();
    });
  }, function (err) {
    if (err) {
      return cb(err);
    }

    contents = contents.replace(reg, function (str, key) {
      return str.replace(key, inlineMap[key]);
    });

    module.contents = new Buffer(contents);

    cb();
  });
}

module.exports = mutil.plugin(pkg.name, pkg.version, parse);
