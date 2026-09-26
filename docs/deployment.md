# Deployment

The client and server deploy on their own from `main`. CI has no build job, since both platforms build on deploy.

## Client on Vercel

Vercel builds the client from the repository root, where [vercel.json](../vercel.json) lives. It detects `bun.lock` and installs with Bun.

| Setting               | Value                       |
| --------------------- | --------------------------- |
| Root directory        | Repository root             |
| Build command         | `bun run build`             |
| Output directory      | `client/dist`               |
| `VITE_SERVER_URI` env | URL of the server on Render |

`vercel.json` rewrites every path to `index.html`, so client-side routes work on reload.

## Server on Render

Render runs the server from source with Bun, so it has no build step beyond installing dependencies. Render reads the Bun version from [.bun-version](../.bun-version). Without it, services created before August 2025 default to Bun 1.1, which can't read the text `bun.lock` format.

| Setting        | Value                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Root directory | `server`                                                                  |
| Build command  | `bun install --frozen-lockfile --production --filter bingewatcher-server` |
| Start command  | `bun run start`                                                           |
| `URI` env      | URI of the production database                                            |

The filtered production install only pulls in the server's runtime dependencies. It skips the client packages and the test-only mongodb-memory-server, which would otherwise download a MongoDB binary. Render sets `PORT`, which the server listens on.

### Back to [documentation](./README.md).
