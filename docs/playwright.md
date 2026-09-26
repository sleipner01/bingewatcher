# Playwright setup

The end-to-end tests in [client/\_\_e2e\_\_](../client/__e2e__) run with Playwright in Chromium and Firefox.

## Install the browsers

From the `client` folder, run:

```bash
bunx playwright install chromium firefox
```

## Run the tests

From the repository root, run:

```bash
bun run test:e2e
```

Playwright starts the client on http://localhost:5174 and the server on http://localhost:4100. The server runs with `start:e2e`, against an in-memory MongoDB seeded with a small set of movies. The ports differ from the dev servers, so the tests never reuse a dev server connected to another database.

To run only Chromium, as CI does, use `bun run test:e2e:ci` from the `client` folder.

## Tests that need the test database

Tests tagged `@test-db` expect the movies in the shared `test` database, and are skipped by default. To run the whole suite against that database, set its URI:

```bash
E2E_TEST_DB_URI=<mongodb-test-uri> bun run test:e2e
```

> Never point `E2E_TEST_DB_URI` at the production database. The tests add ratings and watchlist entries, and the assertions only hold for the test data.

### Back to [documentation](./README.md).
