var fs = require('fs');
var os = require('os');
var zlib = require('zlib');
var spawn = require('child_process').spawn;
var PassThrough = require('stream').PassThrough;
var util = require('util');
var tar = require('tar');
var async = require('async');
var mktmpdir = require('mktmpdir');
var Client = require('./client');
var FilterDiff = require('./filter-diff');

exports = module.exports = npmdiff;

function npmdiff(pkg, verA, verB, opts) {
  opts = opts || {};
  var diff = new Npmdiff(pkg, verA, verB, opts);
  if (opts.path) {
    diff = diff.pipe(new FilterDiff(opts.path));
  }
  return diff;
}

util.inherits(Npmdiff, PassThrough);

function Npmdiff(pkg, verA, verB, opts) {
  PassThrough.call(this, opts);

  var client = new Client(opts.registry);
  var self = this;

  mktmpdir(function(err, dir, clean) {
    async.map([verA, verB], function(ver, callback) {
      client.fetch(pkg, ver, function(err, res, data) {
        if (err) return callback(err);

        var basename = data.version;
        var path = dir + '/' + basename;
        self.extract(res, path, function() {
          callback(null, basename);
        });
      });
    }, function(err, paths) {
      if (err) return self.emit('error', err);

      self.execDiff(paths[0], paths[1], dir)
        .on('end', clean);
    });
  });
}

Npmdiff.prototype.extract = function(src, path, callback) {
  src
    .on('error', callback)
    .pipe(zlib.Unzip())
    .on('error', callback)
    .pipe(tar.Extract({path: path, strip: 1}))
    .on('error', callback)
    .on('end', callback);
};

Npmdiff.prototype.execDiff = function(pathA, pathB, cwd) {
  return spawn('diff', ['-p', '-r', '-u', '-N', pathA, pathB], {cwd: cwd})
    .on('error', this.emit.bind(this, 'error'))
    .stdout
    .pipe(this);
};
