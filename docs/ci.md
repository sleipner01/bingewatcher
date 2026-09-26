# Continuous integration

CI runs on [GitHub Actions](../.github/workflows/ci.yml) for every pull request and every push to `main`. A new push cancels the run still in progress for the same branch.

## Jobs

The jobs run in parallel:

| Job                | What it runs                                                                      |
| ------------------ | --------------------------------------------------------------------------------- |
| Lint and typecheck | `bun run lint`, `bun run lint:style`, `bun run format:check`, `bun run typecheck` |
| Client unit tests  | `bun run test:unit` in `client`                                                   |
| Server tests       | `bun test` in `server`, against an in-memory MongoDB                              |
| End-to-end tests   | `bun run test:e2e:ci` in `client`, in Chromium, against the `test` database       |

There is no build job. Vercel builds the client and Render runs the server on deploy.

To run the same checks locally, except the end-to-end tests:

```bash
bun run check
```

## Speed

- The [setup-bun](../.github/actions/setup-bun/action.yml) composite action caches Bun's package store, and each job installs only the workspaces it needs.
- The MongoDB binary for the server tests and Playwright's Chromium are cached between runs.
- The end-to-end tests only install Chromium's headless shell. GitHub's Ubuntu runners already have the system libraries it needs.

## End-to-end tests

The end-to-end job needs the `DB_URI` repository secret, set to the URI of the `test` database. It fails early with an error when the secret is missing. Pull requests from forks don't get repository secrets, so the job is skipped for them.

The tests run one at a time in CI, since they share the database. When they fail, the Playwright report is uploaded as an artifact.

## GitLab

The project used to run on GitLab. The old [.gitlab-ci.yml](../.gitlab-ci.yml) is kept for reference but is no longer used.

### Back to [documentation](./README.md).
