# Bingewatcher <img src="./client/public/camera-blue.svg" height=40>

Bingewatcher is a platform for finding movies. Users can search for movies, filter them by category, sort them by title or rating, add them to a watchlist and rate them. Personal ratings are stored per user, and each movie shows the average rating across all users.

<img src="./docs/img/bingewatcher-main.jpg">

The project is live at:

> https://bingewatcher.magnusbyrkjeland.no

> <i>Note: The server sleeps when idle. If no movies show up, refresh the page after about a minute 🚀</i>

## Contributors

| <div style="width:180px">Full Name</div>              | Email                 |
| ----------------------------------------------------- | --------------------- |
| [Magnus Tomter Ouren](https://github.com/magnusouren) | magnutou@stud.ntnu.no |
| [Ole Remi Dahl](https://github.com/oleremidahl)       | olerd@stud.ntnu.no    |
| [Jakob Relling](https://github.com/Jakob-ere)         | jakobere@stud.ntnu.no |
| [Magnus Byrkjeland](https://github.com/sleipner01)    | magnueb@stud.ntnu.no  |

## Tech stack

| Part    | Technologies                                                                 |
| ------- | ---------------------------------------------------------------------------- |
| Client  | React 19, TypeScript 7, Vite, MUI, Apollo Client, React Router, SCSS modules |
| Server  | Bun, Apollo Server, GraphQL, Mongoose, MongoDB                               |
| Testing | Vitest and Testing Library (client), `bun test` (server), Playwright (e2e)   |
| Tooling | Bun workspaces, Oxlint, Stylelint, Prettier, GitHub Actions                  |
| Hosting | Vercel (client), Render (server)                                             |

## Project structure

The repository is a [Bun workspace](https://bun.sh/docs/install/workspaces) with two packages:

- [`client`](./client/README.md) is the React frontend.
- [`server`](./server/README.md) is the GraphQL API.

The root holds the shared tooling (TypeScript, Oxlint, Stylelint, Prettier) and scripts that run across both packages. More documentation is in the [docs](./docs/README.md) folder.

## Requirements

- [Bun](https://bun.sh) 1.4 or newer. The exact version is pinned in `packageManager` in [package.json](./package.json).
- A MongoDB connection string to run the server against real data. The tests don't need one.

Install Bun with:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Getting started

1. Install the dependencies for every workspace:

   ```bash
   bun install
   ```

2. Create `server/.env` with the database URI:

   ```env
   URI=<mongodb-test-uri>
   ```

3. Create `client/.env` pointing the client at the local server:

   ```env
   VITE_SERVER_URI=http://localhost:4000
   ```

4. Start the client and server:

   ```bash
   bun run dev
   ```

   The client runs at http://localhost:5173 and the server at http://localhost:4000. Both reload on code changes.

To start only one of them, use `bun run dev:client` or `bun run dev:server`.

## Scripts

Run these from the repository root. Each workspace also has its own scripts, described in the [client](./client/README.md#scripts) and [server](./server/README.md#scripts) READMEs.

### Development

| <div style="width:170px">Command</div> | Description                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `bun install`                          | Installs the dependencies for every workspace.                                                                                |
| `bun run dev`                          | Starts the client and server in watch mode.                                                                                   |
| `bun run dev:client`                   | Starts the client in watch mode.                                                                                              |
| `bun run dev:server`                   | Starts the server in watch mode.                                                                                              |
| `bun run build`                        | Type-checks and builds the client into `client/dist`.                                                                         |
| `bun run check`                        | Runs lint, style lint, format check, typecheck and all tests. It's the same set of checks as CI, except the end-to-end tests. |

### Testing

| <div style="width:170px">Command</div> | Description                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `bun run test`                         | Runs the client unit tests and the server tests.                                              |
| `bun run test:unit`                    | Runs the client unit tests with Vitest.                                                       |
| `bun run test:server`                  | Runs the server tests with `bun test` against an in-memory MongoDB.                           |
| `bun run test:e2e`                     | Runs the Playwright tests in Chromium and Firefox. See [End-to-end tests](#end-to-end-tests). |
| `bun run coverage`                     | Runs the client unit tests with coverage. The report is written to `client/coverage`.         |

### Code quality

| <div style="width:170px">Command</div> | Description                                                              |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `bun run lint`                         | Lints JavaScript and TypeScript with Oxlint, including type-aware rules. |
| `bun run lint:style`                   | Lints the SCSS modules with Stylelint.                                   |
| `bun run lint:fix`                     | Applies the automatic fixes from Oxlint and Stylelint.                   |
| `bun run format`                       | Formats the repository with Prettier.                                    |
| `bun run format:check`                 | Checks the formatting without changing files.                            |
| `bun run typecheck`                    | Type-checks the client and its config files with TypeScript 7.           |

The repository recommends VS Code extensions for Oxc, Prettier and Stylelint, and fixes lint issues on save.

## End-to-end tests

The Playwright tests run against an in-memory MongoDB seeded with a small set of movies, so they need no database access. Before the first run, install the browsers:

```bash
cd client
bunx playwright install chromium firefox
```

Then run:

```bash
bun run test:e2e
```

Playwright starts its own client and server on separate ports. Tests tagged `@test-db` expect the movies in the shared `test` database and are skipped. See [docs/playwright.md](./docs/playwright.md) for how to run them.

## Continuous integration

[GitHub Actions](./.github/workflows/ci.yml) runs on every pull request and on pushes to `main`. Lint and typecheck, client unit tests, server tests and end-to-end tests run as parallel jobs. There is no build job, since Vercel and Render build on deploy. See [docs/ci.md](./docs/ci.md).

## Deployment

- **Client:** Vercel builds and deploys `client` from `main`. Set `VITE_SERVER_URI` to the server URL in the Vercel project.
- **Server:** Render runs `server` with Bun. Set the `URI` environment variable to the production database URI.

See [docs/deployment.md](./docs/deployment.md) for the build settings.
