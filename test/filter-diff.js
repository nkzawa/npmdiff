describe('FilterDiff', function() {
  var expect = require('expect.js');
  var npmdiff = require('../');

  it('should filter', function(done) {
    var filterDiff = new npmdiff.FilterDiff('foo')
    var foo = [
      'diff --recursive --unified 1.0.0/foo/index.js 1.0.1/foo/index.js',
      '--- 1.0.0/foo/index.js 2014-09-01 00:00:00.000000000 +0000',
      '+++ 2.0.0/foo/index.js 2014-09-01 00:00:00.000000000 +0000',
      '@@ -1 +1 @@',
      '-exports.foo = 1;',
      '+exports.foo = 2;'
    ].join('\n') + '\n';
    var bar = [
      'diff --recursive --unified 1.0.0/bar/index.js 1.0.1/bar/index.json',
      '--- 1.0.0/bar/index.js 2014-09-01 00:00:00.000000000 +0000',
      '+++ 2.0.0/bar/index.js 2014-09-01 00:00:00.000000000 +0000',
      '@@ -1 +1 @@',
      '-exports.bar = 1;',
      '+exports.bar = 2;'
    ].join('\n') + '\n';

    var data = '';
    filterDiff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain(foo);
      expect(data).not.to.contain(bar);
      done();
    });
    filterDiff.write(foo);
    filterDiff.write(bar);
    filterDiff.end();
  });
});
