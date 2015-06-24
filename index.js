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

  async.eachSeries(contents.match(reg) || [], function (relative, cb) {
    var result = reg.exec(relative);
    this.getModule(result[2], function (err, module) {
      if (err) {
        return cb(err);
      }

      dataURIMap[result[1]] = mutil.getDataURI(module.destAbsPath);
      cb();
    }.bind(this));
  }.bind(this), function (err) {
    if (err) {
      return cb(new mutil.PluginError(pkg.name, err, {
        fileName: this.file.path,
        showStack: true
      }));
    }

    contents = contents.replace(reg, function (str, key) {
      return str.replace(key, dataURIMap[key]);
    });

    this.contents = new Buffer(contents);

    cb();
  }.bind(this));
}

module.exports = parse;
