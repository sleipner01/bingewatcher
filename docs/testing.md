# Testing Strategy

This section provides an overview of the testing strategy for the project. It describes the different types of tests and how they are used in client and server.

## Client

### Unit testing

We have used Vitest and React Testing Library to test our components. We have used snapshot testing to test that the components render correctly. We have also used unit testing to test the functions in our components.

We have written unit tests for most of the functions in our components. The test is written to test one function at a time. Most of the test are written to simulate a user interaction with the component. The test is named after the function it is testing. This makes it easier to identify which function is failing if a test fails.

More detailed information about tests for each component can be found in their own testing readme files within the `__tests__` folders.

### End to end testing

We have used Playwright to write end to end tests for the project. We have written tests to simulate anticipated user interactions with the site. They coinside with our [userstories](./userstories.md).
The tests naturally also test related functionality, such as user login and settings like dark mode.
If we had more time and resources, we would have written end to end tests for accessability-considerations like keyboard navigation.

The tests are located in the [\_\_e2e\_\_](../client/__e2e__) folder. See [Playwright setup](./playwright.md) for how to run them.

> By default, the end to end tests run against an in-memory MongoDB seeded with a small set of movies, so they never touch a shared database. Tests tagged `@test-db` expect the movies in the `test` database and only run when `E2E_TEST_DB_URI` points at it. That data isn't reset after each run, so those tests are written so that repeated runs don't change their results.

## Server

The server uses `bun test` to run unit tests against an in-memory MongoDB. Only the resolvers are tested, as we didn't find it important to test any other functionality in the server. The tests run each resolver with different inputs to ensure that the resolvers return the correct data.
