var os = require('os');
var Transform = require('stream').Transform;
var util = require('util');
var colors = require('ansicolors');

module.exports = ColorStat;

util.inherits(ColorStat, Transform);

function ColorStat(opts) {
  Transform.call(this, opts);
  this.tail = '';
}

ColorStat.prototype._transform = function(chunk, encoding, done) {
  chunk = this.tail + chunk;
  var lines = chunk.split(os.EOL);
  this.tail = lines.pop();

  lines = lines.map(this.line, this);
  this.push(lines.join(os.EOL) + os.EOL);
  done();
};

ColorStat.prototype._flush = function(done) {
  this.push(this.line(this.tail));
  done();
};

ColorStat.prototype.line = function(line) {
  var parts = line.split(' ');
  var tail = parts.pop();
  var m = /^(\+*)(\-*)$/.exec(tail);
  if (!m) return line;

  var plus = m[1] ? colors.green(m[1]) : '';
  var minus = m[2] ? colors.red(m[2]) : '';
  parts.push(plus + minus);
  return parts.join(' ');
};
