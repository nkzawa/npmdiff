var os = require('os');
var Transform = require('stream').Transform;
var util = require('util');
var colors = require('ansicolors');

module.exports = ColorDiff;

util.inherits(ColorDiff, Transform);

function ColorDiff(opts) {
  Transform.call(this, opts);
  this.tail = '';
  this.searching = false;
}

ColorDiff.prototype._transform = function(chunk, encoding, done) {
  chunk = this.tail + chunk;
  var lines = chunk.split(os.EOL);
  this.tail = lines.pop();

  lines = lines.map(this.line, this);
  this.push(lines.join(os.EOL) + os.EOL);
  done();
};

ColorDiff.prototype._flush = function(done) {
  this.push(this.line(this.tail));
  done();
};

ColorDiff.prototype.line = function(line) {
  if (!this.searching) {
    this.searching = line.slice(0, 2) === '@@';
    if (!this.searching) return line;
  }

  switch (line[0]) {
  case ' ':
    break;
  case '@':
    var marker = '@@';
    var i = line.indexOf(marker, 1) + marker.length;
    line = colors.cyan(line.slice(0, i)) + line.slice(i);
    break;
  case '-':
    line = colors.red(line);
    break;
  case '+':
    line = colors.green(line);
    break;
  default:
    this.searching = false;
  }
  return line;
};
