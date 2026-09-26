import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Genre from '../../models/Genre';
import Movie from '../../models/Movie';
import Watchlist from '../../models/Watchlist';
import watchlistResolver from '../watchlistResolver';

// Create an in-memory MongoDB server for testing
let mongod;

// Get the Query and Mutation objects from the watchlistResolver
const { Query: watchlistQuery, Mutation: watchlistMutation } = watchlistResolver;

// Utility function for seeding watchlist
async function seedWatchlist(watchlists) {
  for (const watchlist of watchlists) {
    await new Watchlist(watchlist).save();
  }
}

async function seedMovies(movies) {
  for (const movie of movies) {
    await new Movie(movie).save();
  }
}

async function seedGenre(users) {
  for (const user of users) {
    await new Genre(user).save();
  }
}

// Before all tests, start the in-memory MongoDB server and connect to it
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// After each test, clear the database
afterEach(async () => {
  await Watchlist.deleteMany({});
});

// After all tests, disconnect and stop the in-memory MongoDB server
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

const mockedMovies = [
  {
    _id: 1,
    title: 'The Accountant',
    genre_ids: [
      {
        _id: 28,
        name: 'Action',
      },
      {
        _id: 12,
        name: 'Drama',
      },
    ],
    overview: 'test',
    release_date: '2016-10-14',
    adult: false,
    poster_path: '/9JKtBZxpKsuXlJg3ePOITn5cRru.jpg',
    video: false,
    vote_average: 7.3,
    vote_count: 4859,
  },
  {
    _id: 2,
    title: 'Another Movie',
    genre_ids: [
      {
        _id: 28,
        name: 'Action',
      },
      {
        _id: 12,
        name: 'Drama',
      },
    ],
    overview: 'test',
    release_date: '2016-10-14',
    adult: false,
    poster_path: '/9JKtBZxpKsuXlJg3ePOITn5cRru.jpg',
    video: false,
    vote_average: 7.3,
    vote_count: 4859,
  },
];

describe('watchlistResolver', () => {
  describe('Query', () => {
    describe('getWatchlistByUserID', () => {
      it('should return a watchlist for a specific user', async () => {
        // Seed the database with a watchlist
        await seedWatchlist([{ userID: '1', movies: ['1', '2'] }]);
        await seedMovies([mockedMovies[0], mockedMovies[1]]);
        await seedGenre(mockedMovies[0].genre_ids);

        // Get the watchlist for the user with ID 1
        const watchlist = await watchlistQuery.getWatchlistByUserID(null, { userID: '1' });

        expect(watchlist.userID).toBe('1');
        expect(watchlist.movies).toHaveLength(2);
      });

      it('should return null if the user does not exist', async () => {
        const watchlist = await watchlistQuery.getWatchlistByUserID(null, { userID: '1' });
        expect(watchlist).toBeNull();
      });
    });
  });

  describe('Mutation', () => {
    describe('addMovieToWatchlist', () => {
      it("should add a movie to a user's watchlist", async () => {
        // Seed the database with a watchlist
        await seedWatchlist([{ userID: '1', movies: ['1'] }]);

        // Add a movie to the watchlist
        const updatedWatchlist = await watchlistMutation.addMovieToWatchlist(null, {
          userID: '1',
          movieID: '2',
        });

        expect(updatedWatchlist.userID).toBe('1');
        expect(updatedWatchlist.movies.map((movie) => movie.id)).toContain('2');
        expect(updatedWatchlist.movies).toHaveLength(2);
      });

      it('should not add a movie to the watchlist if it already exists', async () => {
        // Seed the database with a watchlist
        await seedWatchlist([{ userID: '1', movies: ['1', '2'] }]);

        // Attempt to add a movie that's already in the watchlist
        const updatedWatchlist = await watchlistMutation.addMovieToWatchlist(null, {
          userID: '1',
          movieID: '2',
        });

        expect(updatedWatchlist.userID).toBe('1');
        expect(updatedWatchlist.movies.filter((movie) => movie.id === '2')).toHaveLength(1);
        expect(updatedWatchlist.movies).toHaveLength(2); // Length should not change
      });

      it('should create a new watchlist if one does not exist for the user', async () => {
        // Attempt to add a movie that's already in the watchlist
        const updatedWatchlist = await watchlistMutation.addMovieToWatchlist(null, {
          userID: '2',
          movieID: '2',
        });

        expect(updatedWatchlist).toBeDefined();
        expect(updatedWatchlist.userID).toBe('2');
        expect(updatedWatchlist.movies).toHaveLength(1); // Length should not change
      });
    });
  });
});
