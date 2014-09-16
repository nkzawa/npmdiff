var nock = require('nock');

exports.mockRegistry = function() {
  var registry = 'http://localhost';
  nock(registry)
    .get('/foo/1.0.0')
    .replyWithFile(200, __dirname + '/../registry/foo/1.0.0/package/package.json')
    .get('/foo/1.0.1')
    .replyWithFile(200, __dirname + '/../registry/foo/1.0.1/package/package.json')
    .get('/bar/0.1.0')
    .replyWithFile(200, __dirname + '/../registry/bar/0.1.0/package/package.json')
    .get('/bar/0.1.1')
    .replyWithFile(200, __dirname + '/../registry/bar/0.1.1/package/package.json')
    .get('/baz/0.0.0')
    .replyWithFile(200, __dirname + '/../registry/baz/0.0.0/package/package.json')
    .get('/baz/0.0.1')
    .replyWithFile(200, __dirname + '/../registry/baz/0.0.1/package/package.json')
    .get('/foo/-/foo-1.0.0.tgz')
    .replyWithFile(200, __dirname + '/../registry/foo/1.0.0/package.tgz')
    .get('/foo/-/foo-1.0.1.tgz')
    .replyWithFile(200, __dirname + '/../registry/foo/1.0.1/package.tgz');
  return registry;
};
