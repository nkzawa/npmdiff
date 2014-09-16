describe('ColorStat', function() {
  var expect = require('expect.js');
  var npmdiff = require('../');

  it('should get colored', function(done) {
    var colorStat = new npmdiff.ColorStat()
    var stat = [
      'foo.js |    6 +++----',
      'bar.js |    1 +',
      'baz.js |    1 -',
      '3 files changed, 4 insertions(+), 5 deletions(-)'
    ].join('\n') + '\n';

    var data = '';
    colorStat.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain('\u001b[32m+++\u001b[39m\u001b[31m----\u001b[39m\n');
      expect(data).to.contain('\u001b[32m+\u001b[39m\n');
      expect(data).to.contain('\u001b[31m-\u001b[39m\n');
      done();
    });
    colorStat.end(stat);
  });
});
