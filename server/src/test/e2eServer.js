import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Genre from '../models/Genre.js';
import Movie from '../models/Movie.js';

const genres = [
  { _id: 18, name: 'Drama' },
  { _id: 28, name: 'Action' },
  { _id: 35, name: 'Comedy' },
];

const movies = Array.from({ length: 20 }, (_, i) => ({
  _id: i + 1,
  title: `E2E Movie ${String.fromCharCode(65 + i)}`,
  genre_ids: [genres[i % genres.length]._id],
  overview: 'A movie seeded for the end-to-end tests.',
  release_date: '2024-01-01',
  vote_average: (i % 10) + 0.5,
  vote_count: 10,
}));

// Starts the server against an in-memory database seeded with a small, predictable set of movies
const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri('bingewatcher');

await mongoose.connect(uri);
await Genre.create(genres);
await Movie.create(movies);
await mongoose.disconnect();

process.env.URI = uri;
await import('../index.js');
