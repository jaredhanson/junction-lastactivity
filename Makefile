NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js test/**/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/junction/*.js
	dox \
		--title junction-lastactivity \
		--desc "Last Activity middleware for Junction" \
		$(shell find lib/junction-lastactivity/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
