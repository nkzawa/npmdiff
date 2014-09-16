describe('npmdiff', function() {
  var expect = require('expect.js');
  var support = require('./support');
  var npmdiff = require('../');

  beforeEach(function() {
    this.registry = support.mockRegistry();
  });

  it('should get diff', function(done) {
    var diff = npmdiff('foo', '1.0.0', '1.0.1', {registry: this.registry});
    var data = '';
    diff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain('diff ');
      expect(data).to.contain(' 1.0.0/lib/index.js 1.0.1/lib/index.js');
      expect(data).to.contain('--- 1.0.0/lib/index.js');
      expect(data).to.contain('+++ 1.0.1/lib/index.js');
      expect(data).to.contain('@@ ');
      expect(data).to.contain(' 1.0.0/package.json 1.0.1/package.json');
      expect(data).to.contain('--- 1.0.0/package.js');
      expect(data).to.contain('+++ 1.0.1/package.js');
      done();
    });
  });

  it('should get filtered diff', function(done) {
    var diff = npmdiff('foo', '1.0.0', '1.0.1', {path: 'lib', registry: this.registry});
    var data = '';
    diff.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      expect(data).to.contain('diff ');
      expect(data).to.contain(' 1.0.0/lib/index.js 1.0.1/lib/index.js');
      expect(data).to.contain('--- 1.0.0/lib/index.js');
      expect(data).to.contain('+++ 1.0.1/lib/index.js');
      expect(data).to.contain('@@ ');
      expect(data).not.to.contain('package.json');
      done();
    });
  });
});
