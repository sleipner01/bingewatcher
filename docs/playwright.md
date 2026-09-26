# Playwright setup

The end-to-end tests in [client/\_\_e2e\_\_](../client/__e2e__) run with Playwright in Chromium and Firefox.

## Install the browsers

From the `client` folder, run:

```bash
bunx playwright install chromium firefox
```

## Run the tests

The tests expect the movies in the `test` database, so `server/.env` must point at it. Then run, from the repository root:

```bash
bun run test:e2e
```

Playwright starts the client on http://localhost:5173 and the server on http://localhost:4000. If they are already running, it reuses them. To run only Chromium, as CI does, use `bun run test:e2e:ci` from the `client` folder.

> Never run the tests against the production database. They add ratings and watchlist entries, and the assertions only hold for the test data.

### Back to [documentation](./README.md).
