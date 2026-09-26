# Server

This folder contains the server code for the project. The server is built with Node.js and JavaScript. The server is built with Apollo Server and uses Mongoose to connect to the MongoDB database. Testing is done with Vitest.

This readme is intended to provide a brief overview of the project setup and available scripts. More detailed documentation can be found in the [docs](../docs) folder.

## Remote Connection

The project has two servers hosted on our virtual machine at NTNU. The main server running the production database is available at the following URL:

> http://it2810-16.idi.ntnu.no:4000/

An additional development and testing server is available at the following URL:

> http://it2810-16.idi.ntnu.no:4001/

It runs with the testing database. More information about the database can be read in the [database documentation](../docs/database.md).

If you wish to set up a local server, follow the [guide below](./README.md#installation).

## Server structure

The server structure is described in [filestructure-project.md](../docs/filestructure-project.md).

## Third party libraries

The server is written in Javascript and uses the following technologies:

- [Node.js](https://nodejs.org/en/)

JavaScript runtime. It was chosen because of its popularity and the fact that it is easy to get started with. The syntax is similar to TypeScript, which is used in the client. It comes with support for useful libraries which is listed below.

- [Mongoose](https://mongoosejs.com/)

MongoDB object modeling. It integrates well with Apollo Client and makes it easier to work with MongoDB through queries in the server.

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

GraphQL server. Chosen over Express because of its built-in support for GraphQL.

- [GraphQL](https://graphql.org/)

Required Query language for the API, based on the task description. It is a good choice for this project because of its flexibility and natural integration with Apollo Server.

## Queries and mutations

The server uses GraphQL to communicate with the client. The queries and mutations are described below:

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

The queries and mutations are also located in the [schema.graphql](./src/schema.graphql) file.

## Database

More information about the database can be read in the [database documentation](../docs/database.md).

## Run the server locally

If you have not already done so, run the following command to install all dependencies:

```cli
bun install
```

> <i>Note: You will need to install the packages in root to enable Typescript and linting.</i>

### Configuration

To use the commands below, you will need to configure the database URI. Create a `.env` file in the root of the server directory. The file should contain the following variables:

```.env
URI = <mongodb-test-uri>
```

For development, use the `test` database URI. This will also be used in the CI/CD pipeline.

<hr />

For production, use the `production` database URI. It should be put in a `.env.production` file in the root of the server directory. The file should contain the following variables:

```.env
URI = <mongodb-production-uri>
```

> <b>Note:</b> Your MongoDB user should have read and write access to the `test`- or `bingewatcher` database. Your user and URI must be granted by the current contributors of Team 16. Your IP address must also be whitelisted.

### Usage

To start development server, run:

```bash
bun run dev
```

This will by default start the server on port 4000. Any code changes will trigger automatic server restart. The server runs with `bun --watch`.

## Available Scripts

### Setup

| <div style="width:210px">Command</div> | Description                                                                                                                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun install`                          | Installs dependencies for `server`. <br> **Note**: You will need to install the packages in root to enable Typescript and linting.                                                                                  |
| `bun run start`                        | Starts the server with default configuration.<br /> **Note**: You will need a `.env` file with a valid URI.                                                                                                         |
| `bun run dev`                          | Starts the project in development mode. The project will run locally on a local port number. Any code changes will trigger automatic browser updates.<br /> **Note**: You will need a `.env` file with a valid URI. |
| `bun run start:production`             | Starts the project in production mode. The project will run locally on a local port number.<br /> **Note**: You will need a `.env.production` file with a valid URI to the production database.                     |

### Testing

| <div style="width:210px">Command</div> | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `bun run test`                         | Runs all tests for the server with Vitest. |

### Manual environment

<i>To configure the URI of the database manually, add the URI as an argument to the `bun run start` command in manual environment:</i>

```bash
NODE_ENV=manual bun run start mongodb://localhost:27017/bingewatcher
```

Within any environment, you can also set the port manually by prepending the `PORT` variable to the `bun run start` command:

```bash
PORT=4000 bun run start
```

### CI/CD

To start the server in a CI environment add the database URI as an argument to the `bun run start` command through a secret.
Say the secret is called `DB_URI`, the CI config should call:

```bash
bun run start $DB_URI
```

To simulate the command locally, run:

```bash
CI=true bun run start $DB_URI
```
