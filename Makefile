
MOCHA_OPTS = --check-leaks --bail
REPORTER = dot

test:
	@cd ./test/registry/foo/1.0.0 && tar czf package.tgz package
	@cd ./test/registry/foo/1.0.1 && tar czf package.tgz package
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

.PHONY: test
