# Bingewatcher Client

The frontend is a React 19 app written in TypeScript and built with Vite. It fetches data from the GraphQL API with Apollo Client. Unit tests use Vitest and React Testing Library, and end-to-end tests use Playwright.

More documentation is in the [docs](../docs/README.md) folder:

- [Project structure](../docs/filestructure-project.md)
- [Component structure](../docs/filestructure-component.md)
- [Testing strategy](../docs/testing.md)

## Libraries

- [MUI](https://mui.com/) provides the UI components.
- [SCSS modules](https://sass-lang.com/) style the components, with shared variables and breakpoints in [src/styles](./src/styles).
- [Apollo Client](https://www.apollographql.com/docs/react/) fetches and caches data from the GraphQL API. The queries are typed in [src/graphql/queries.ts](./src/graphql/queries.ts).
- [React Router](https://reactrouter.com/) handles routing. The routes are defined in [src/routes.tsx](./src/routes.tsx).
- [Playwright](https://playwright.dev/) runs the end-to-end tests in [\_\_e2e\_\_](./__e2e__).

## Run the client

Create a `.env` file in the `client` folder with the URL of the server:

```env
VITE_SERVER_URI=http://localhost:4000
```

To run the server locally, follow the [server README](../server/README.md#run-the-server-locally). Then install the dependencies from the repository root and start the client:

```bash
bun install
bun run dev
```

The client runs at http://localhost:5173 and reloads on code changes.

## Scripts

Run these from the `client` folder.

| <div style="width:170px">Command</div> | Description                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `bun run dev`                          | Starts the Vite dev server.                                                                       |
| `bun run build`                        | Type-checks and builds the client into `dist`.                                                    |
| `bun run preview`                      | Serves the production build locally.                                                              |
| `bun run typecheck`                    | Type-checks the app, the config files and the end-to-end tests.                                   |
| `bun run test`                         | Runs the unit tests, then the end-to-end tests.                                                   |
| `bun run test:unit`                    | Runs the unit tests once.                                                                         |
| `bun run test:unit:watch`              | Runs the unit tests in watch mode.                                                                |
| `bun run coverage`                     | Runs the unit tests with coverage. The report is written to [coverage](./coverage/index.html).    |
| `bun run test:e2e`                     | Runs the end-to-end tests in Chromium and Firefox. See [Playwright setup](../docs/playwright.md). |
| `bun run test:e2e:ci`                  | Runs the end-to-end tests in Chromium only, as CI does.                                           |
