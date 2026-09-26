import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import Movie from '../../models/Movie';
import Rating from '../../models/Rating';
import ratingResolver from '../ratingResolver';

// Create an in-memory MongoDB server for testing
let mongod;

// Get the Query and Mutation objects from the ratingResolver
const { Query: ratingQuery, Mutation: ratingMutation } = ratingResolver;

// Utility function for seeding ratings
const seedRatings = async (ratings) => {
  for (const rating of ratings) {
    await new Rating(rating).save();
  }
};

const seedMovies = async (movies) => {
  for (const movie of movies) {
    await new Movie(movie).save();
  }
};

// Before all tests, start the in-memory MongoDB server and connect to it
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// After each test, clear the database
afterEach(async () => {
  await Rating.deleteMany({});
});

// After all tests, disconnect and stop the in-memory MongoDB server
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('ratingResolver', () => {
  describe('Query', () => {
    describe('getRatingsByUserID', () => {
      it('should return ratings for a specific user', async () => {
        // Seed the database with ratings for two different users
        await seedRatings([
          { _id: '1', ratings: [{ movieID: '1', rating: 5 }] },
          { _id: '2', ratings: [{ movieID: '2', rating: 8 }] },
        ]);

        const user1Ratings = await ratingQuery.getMovieRatingWithUserID(null, { userID: '1', movieID: '1' });
        expect(user1Ratings).toBeDefined();

        expect(user1Ratings.rating).toBe(5);

        const user2Ratings = await ratingQuery.getMovieRatingWithUserID(null, { userID: '2', movieID: '2' });
        expect(user2Ratings).toBeDefined();
        expect(user2Ratings.rating).toBe(8);
      });
    });
  });

  describe('Mutation', () => {
    describe('addRating', () => {
      it('should add a new rating for a movie by a user', async () => {
        await seedMovies([
          {
            _id: '9999',
            title: 'The Accountant',
            release_date: '2016-10-14',
            genres: [28],
            overview: 'test',
            runtime: 128,
            vote_average: 7.3,
            vote_count: 4859,
            poster_path: '/9JKtBZxpKsuXlJg3ePOITn5cRru.jpg',
          },
        ]);

        const newRating = await ratingMutation.addRating(null, {
          userID: '1',
          movieID: '9999',
          rating: 7,
        });

        expect(newRating).toBeDefined();

        expect(newRating.movieID).toBe(9999);
        expect(newRating.rating).toBe(7);
      });

      it('should update an existing rating for a movie by a user', async () => {
        // Seed with an existing rating

        await seedRatings([{ _id: '1', ratings: [{ movieID: '9999', rating: 5 }] }]);

        // Update the rating
        const updatedRating = await ratingMutation.addRating(null, {
          userID: '1',
          movieID: '9999',
          rating: 8.5,
        });

        expect(updatedRating).toBeDefined();
        expect(updatedRating.rating).toBe(8.5);
        expect(updatedRating.movieID).toBe(9999);
      });

      it('should throw an error if the rating is not between 0 and 9', async () => {
        // Seed with an existing rating
        await seedRatings([{ _id: '1', ratings: [{ movieID: '9999', rating: 5 }] }]);

        // Update the rating
        const addRating = ratingMutation.addRating(null, {
          userID: '1',
          movieID: '9999',
          rating: 11,
        });

        await expect(addRating).rejects.toThrow('Rating must be between 0 and 10');

        const addRating2 = ratingMutation.addRating(null, {
          userID: '1',
          movieID: '9999',
          rating: -1,
        });

        await expect(addRating2).rejects.toThrow('Rating must be between 0 and 10');

        const addRating3 = ratingMutation.addRating(null, {
          userID: '1',
          movieID: '9999',
          rating: 0,
        });

        await expect(addRating3).rejects.toThrow('Rating must be between 0 and 10');
      });
    });
  });
});
