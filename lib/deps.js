var async = require('async');
var semver = require('semver');
var Client = require('./client');

module.exports = deps

function deps(pkg, verA, verB, opts, callback) {
  if ('function' === typeof opts) {
    callback = opts;
    opts = null;
  }
  opts = opts || {};

  var client = new Client(opts.registry);

  async.map([verA, verB], function(ver, callback) {
    client.get(pkg, ver, callback);
  }, function(err, data) {
    if (err) return callback(err);

    var depsA = data[0].dependencies || {};
    var depsB = data[1].dependencies || {};

    var diff = Object.keys(depsA).concat(Object.keys(depsB)).filter(function(v, i, arr) {
      // unique
      return arr.indexOf(v) === i;
    }).filter(function(v) {
      // has diff
      return depsA[v] !== depsB[v];
    }).map(function(v) {
      return [v, depsA[v], depsB[v], [pkg]];
    });

    async.map(diff, function(v, callback) {
      var verA = semver.validRange(v[1]) ? v[1] : null;
      var verB = semver.validRange(v[2]) ? v[2] : null;

      deps(v[0], verA, verB, opts, function(err, diff, dataA, dataB) {
        if (err) return callback(err);

        if (dataA.version) v[1] = dataA.version;
        if (dataB.version) v[2] = dataB.version;

        callback(null, diff);
      });
    }, function(err, d) {
      diff = diff.filter(function(v) {
        return v[1] !== v[2];
      });

      d = d.reduce(function(a, b) {
        return a.concat(b);
      }, []);

      d.forEach(function(v) {
        v[3].unshift(pkg);
      });

      callback(err, diff.concat(d), data[0], data[1]);
    });
  });
}
