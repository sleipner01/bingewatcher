# Bingewatcher Server

The server is a GraphQL API built with Apollo Server and running on Bun. It stores data in MongoDB through Mongoose. Tests use `bun test` against an in-memory MongoDB.

More documentation is in the [docs](../docs/README.md) folder, including the [project structure](../docs/filestructure-project.md) and the [database](../docs/database.md).

## Libraries

- [Bun](https://bun.sh) runs the server, loads `.env` files and runs the tests.
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) serves the GraphQL API.
- [Mongoose](https://mongoosejs.com/) models the MongoDB collections.
- [mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server) provides the in-memory database for tests.

## Queries and mutations

The schema is defined in [src/schema.graphql](./src/schema.graphql):

```graphql
type Query {
  getMovies(page: Int!, userID: String): [Movie]
  getMovieById(id: Int!): Movie
  getMovieByTitle(title: String!): Movie
  getMoviesByTitle(title: String!, limit: Int!, offset: Int!): [Movie]
  getMoviesByGenre(page: Int!, genreId: Int!): [Movie]
  getMovieCountByGenre(genreId: Int): Int
  getMoviesByTitleAZ(page: Int!, genreId: Int, order: String!): [Movie]
  getMoviesByRating(page: Int!, genreId: Int, order: String!): [Movie]
  getMovieRatingWithUserID(userID: String!, movieID: Int!): Rating
  getWatchlistByUserID(userID: String!, page: Int!): UserWatchlist
  getWatchlistCountByUserID(userID: String!): Int
  movieIsInWatchlist(userID: String!, movieID: Int!): Boolean
  getGenres: [Genre]
}

type Mutation {
  addRating(userID: String!, movieID: Int!, rating: Float!): Rating
  addMovieToWatchlist(userID: String!, movieID: Int!): UserWatchlist
  removeMovieFromWatchlist(userID: String!, movieID: Int!): UserWatchlist
}
```

## Run the server locally

Create a `.env` file in the `server` folder with the URI of the `test` database:

```env
URI=<mongodb-test-uri>
```

> <b>Note:</b> Your MongoDB user needs read and write access to the database, and your IP address must be allowed. Ask the contributors for access.

Then install the dependencies from the repository root and start the server:

```bash
bun install
bun run dev
```

The server runs at http://localhost:4000 and restarts on code changes.

### Configuration

The server reads its settings from environment variables, which Bun also loads from `.env` files:

| Variable   | Description                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `URI`      | MongoDB connection string.                                                                                                  |
| `PORT`     | Port to listen on. Defaults to `4000`.                                                                                      |
| `NODE_ENV` | `production` also loads `.env.production` on top of `.env`. With `manual`, the URI is read from the first argument instead. |
| `CI`       | When set, the URI is read from the first argument instead, as the end-to-end tests do in CI.                                |

To pass the URI as an argument:

```bash
NODE_ENV=manual bun run start mongodb://localhost:27017/bingewatcher
```

## Scripts

Run these from the `server` folder.

| <div style="width:190px">Command</div> | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `bun run dev`                          | Starts the server in watch mode.                             |
| `bun run start`                        | Starts the server.                                           |
| `bun run start:production`             | Starts the server with `NODE_ENV=production`.                |
| `bun run test`                         | Runs the tests with `bun test` against an in-memory MongoDB. |

The first test run downloads a MongoDB binary to `~/.cache/mongodb-binaries`.
