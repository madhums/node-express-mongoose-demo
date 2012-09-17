REPORTER = spec
TESTS = test/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		--timeout 500000 \
		--growl \
		--ignore-leaks \
		$(TESTS)

deploy:
	git push && git checkout heroku && git merge master && git push -f heroku heroku:master && git checkout master

.PHONY: deploy
