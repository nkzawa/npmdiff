describe('npmdiff.stat', function() {
  var expect = require('expect.js');
  var support = require('./support');
  var npmdiff = require('../');

  beforeEach(function() {
    this.registry = support.mockRegistry();
  });

  it('should get stat', function(done) {
    var diff = npmdiff.stat('foo', '1.0.0', '1.0.1', {registry: this.registry});
    var data = '';
    diff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain('lib/index.js | ');
      expect(data).to.contain('package.json | ');
      expect(data).to.contain('2 files changed, ');
      done();
    });
  });

  it('should get filtered stat', function(done) {
    var diff = npmdiff.stat('foo', '1.0.0', '1.0.1', {path: 'lib', registry: this.registry});
    var data = '';
    diff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function(chunk) {
      expect(data).to.contain('index.js | ');
      expect(data).to.contain('1 file changed, ');
      expect(data).not.to.contain('package.json');
      done();
    });
  });
});
