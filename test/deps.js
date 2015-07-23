describe('npmdiff.dpes', function() {
  var expect = require('expect.js');
  var support = require('./support');
  var npmdiff = require('../');

  beforeEach(function() {
    this.registry = support.mockRegistry();
  });

  it('should get deps', function(done) {
    npmdiff.deps('foo', '1.0.0', '1.0.1', { registry: this.registry }, function(err, data) {
      expect(err).not.to.be.ok();
      expect(data).to.eql([
        ['bar', '0.1.0', '0.1.1', ['foo']],
        ['baz', '0.0.0', '0.0.1', ['foo', 'bar']]
      ]);
      done();
    });
  });
});
