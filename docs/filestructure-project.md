# Project file structure

To maintain an organized structure in the project, files are organized as follows:

```
├── .github                         # GitHub Actions workflow and setup action
├── .vscode                         # IDE configuration files
├── client                          # Files for front end client
│    ├── __e2e__                    # E2E test files
│    ├── coverage                   # Test coverage reports (ignored by git)
│    ├── dist                       # Build files (ignored by git)
│    ├── node_modules               # Links to the client's dependencies (ignored by git)
│    ├── playwright-report          # Reports from playwright e2e tests (ignored by git)
│    ├── public                     # Public files that will be copied to dist
│    ├── src
│    │   ├── assets                 # Assets used in the project
│    │   ├── components             # All components used in the project
│    │   ├── context                # Context files
│    │   ├── graphql                # Grapqhql queries and mutiations
│    │   ├── layout                 # Layout components
│    │   ├── pages                  # Project pages
│    │   ├── styles                 # Global styles
│    │   ├── utils                  # Shared utility files
│    │   ├── main.tsx               # Main file for the project
│    │   ├── routes.tsx             # Project routing
│    │   ├── types.ts               # Project types
│    │   ├── configuration files    # Other front end configuration files
│    ├── test-results               # Test results from playwright (ignored by git)
│    ├── configuration files        # Front end configuration files
├── docs                            # Documentation files
├── node_modules                    # Dependencies for all workspaces (ignored by git)
├── server                          # Files for back end server
│    ├── node_modules               # Links to the server's dependencies (ignored by git)
│    ├── src
│    │   ├── models                 # Models for graphql
│    │   ├── resolvers              # Resolvers for GraphQL API
│    │   ├── test                   # Test setup
│    │   ├── index.js               # Main file for the server
│    │   ├── schema.graphql         # Schema and types for GraphQL
│    ├── configuration files        # Server configuration files
├── configuration files             # Project configuration files

```

This structure helps keep the project organized and makes it easier to locate and manage different types of files and resources.

### Back to [documentation](./README.md).
