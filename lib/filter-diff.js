var os = require('os');
var Transform = require('stream').Transform;
var util = require('util');
var minimatch = require('minimatch');

module.exports = FilterDiff;

util.inherits(FilterDiff, Transform);

function FilterDiff(pattern, opts) {
  Transform.call(this, opts);
  this.minimatch = new minimatch.Minimatch(pattern + '{,/}**', {
    dot: true,
    noext: true,
    nonegate: true
  });
  this.tail = '';
  this.matched = false;
}

FilterDiff.prototype._transform = function(chunk, encoding, done) {
  chunk = this.tail + chunk;
  var lines = chunk.split(os.EOL);
  this.tail = lines.pop();

  lines = lines.filter(this.match, this);
  chunk = lines.join(os.EOL);
  this.push(chunk ? chunk + os.EOL : '');
  done();
};

FilterDiff.prototype._flush = function(done) {
  if (this.match(this.tail)) {
    this.push(this.tail);
  }
  done();
};

FilterDiff.prototype.match = function(line) {
  if (line.slice(0, 4) === 'diff') {
    // "diff a/lib/foo.js b/lib/foo.js" => "lib/foo.js"
    var path = line.split(' ').pop().split('/').slice(1).join('/');
    this.matched = this.minimatch.match(path);
  }
  return this.matched;
};
