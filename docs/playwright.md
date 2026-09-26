# Playwright Setup

If you wish to run end to end tests, Playwright needs to be installed locally on your machine. If you do not have Playwright installed, navigate to the `client` directory:

```cli
cd client
```

<i>This is to mitigate installation warnings.</i>

Then run the following command to install Playwright:

```cli
bunx playwright install
```

Follow the default installation instructions.

## Running tests

For running end to end tests, please use the commands listed in the client [README.md](../client/README.md#test).

> Please ensure you have pointed the URI to a local server using the testing database, or the testing server. Else the tests will both fail and create noise in the production data.
