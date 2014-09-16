var spawn = require('child_process').spawn;
var npmdiff = require('./');

exports = module.exports = stat;

function stat(pkg, verA, verB, opts) {
  var diffstat = spawn('diffstat');
  npmdiff(pkg, verA, verB, opts).pipe(diffstat.stdin);
  return diffstat.stdout;
}
