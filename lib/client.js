var util = require('util');
var async = require('async');
var npmconf = require('npmconf');
var RegClient = require('npm-registry-client');
var npa = require('npm-package-arg');

var noop = function() {};

var log = {
  error: noop,
  warn: noop,
  info: noop,
  verbose: noop,
  silly: noop,
  http: noop,
  pause: noop,
  resume: noop
};

module.exports = Client;

function Client(registry) {
  this.registry = registry;
  this.conf = null;
  this.regClient = null;
}

Client.prototype.init = function(callback) {
  if (this.regClient) {
    return callback(null, this.regClient);
  }

  var self = this;
  npmconf.load(function(err, conf) {
    if (err) return callback(err);

    conf.log = log;

    self.conf = conf;
    self.regClient = new RegClient(conf);
    callback(null, self.regClient);
  });
};

Client.prototype.get = function(pkg, ver, callback) {
  var self = this;

  this.init(function(err, client) {
    if (err) return callback(err);
    if (!ver) return callback(null, {});

    var uri = self.pkgUrl(pkg, ver);
    client.get(uri, {}, callback);
  });
};

Client.prototype.fetch = function(pkg, ver, callback) {
  var self = this;

  this.init(function(err, client) {
    if (err) return callback(err);

    self.get(pkg, ver, function(err, data) {
      if (err) return callback(err);

      client.fetch(data.dist.tarball, {}, function(err, res) {
        callback(err, res, data);
      });
    });
  });
};

Client.prototype.pkgUrl = function(pkg, ver) {
  var scope = npa(pkg).scope;
  var registry;
  if (scope) {
    // escape
    pkg = pkg.replace('/', '%2f');
    registry = this.conf.get(scope + ':registry');
  }
  registry = this.registry || registry || 'http://registry.npmjs.org';

  var normalized = registry.slice(-1) !== '/' ? registry : registry.slice(0, -1);
  return normalized + '/' + pkg + '/' + encodeURIComponent(ver);
};

