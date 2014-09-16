describe('ColorDiff', function() {
  var expect = require('expect.js');
  var npmdiff = require('../');

  it('should get colored', function(done) {
    var colorDiff = new npmdiff.ColorDiff()
    var diff = [
      'diff --recursive --unified 1.0.0/lib/index.js 1.0.1/lib/index.js',
      '--- 1.0.0/lib/index.js 2014-09-01 00:00:00.000000000 +0000',
      '+++ 1.0.1/lib/index.js 2014-09-01 00:00:00.000000000 +0000',
      '@@ -1 +1 @@',
      '-exports.foo = 1;',
      '+exports.foo = 2;'
    ].join('\n') + '\n';

    var data = '';
    colorDiff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain('\u001b[36m@@ -1 +1 @@\u001b[39m\n');
      expect(data).to.contain('\u001b[31m-exports.foo = 1;\u001b[39m\n');
      expect(data).to.contain('\u001b[32m+exports.foo = 2;\u001b[39m\n');
      done();
    });
    colorDiff.end(diff);
  });
});
