import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Genre from '../../models/Genre';
import Movie from '../../models/Movie';
import movieResolver from '../movieResolver';

// Create an in-memory MongoDB server for testing
let mongod;

// Get the Query object from the movieResolver
const { Query: movieQuery } = movieResolver;

// Utility function for seeding movies
const seedMovies = async (movies) => {
  await Movie.create(movies);
};

// Utility function for seeding genres
const seedGenre = async (genre) => {
  await Genre.create(genre);
};

// Global constants for testing
const ratings = [1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
const genre1 = { _id: 20, name: 'Test' };
const genre2 = { _id: 21, name: 'Test2' };
const pageSize = 16;
const collectionLength = 18;

// Before all tests, start the in-memory MongoDB server and connect to it
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Seed the database with two genres
  await seedGenre(genre1);
  await seedGenre(genre2);

  // Seed the database with 18 test movies
  const movies = Array.from({ length: collectionLength }, (_, i) => ({
    _id: i.toString(),
    title: `Test Movie ${letters[i]}`,
    genre_ids: [i < collectionLength / 2 ? genre1._id : genre2._id],
    overview: 'A test movie',
    release_date: '2023-01-01',
    vote_average: ratings[i],
  }));
  await seedMovies(movies);
});

// After all tests, disconnect and stop the in-memory MongoDB server
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('movieResolver', () => {
  describe('Query', () => {
    describe('getMovies', () => {
      it('should return the right amount of movies', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMovies(null, { page: 1 });
        expect(firstPageResults).toHaveLength(pageSize);

        // Test the second page
        const secondPageResults = await movieQuery.getMovies(null, { page: 2 });
        expect(secondPageResults).toHaveLength(collectionLength - pageSize);
      });
    });

    describe('getMoviesByGenre', () => {
      it('should return movies with the same genre', async () => {
        const result = await movieQuery.getMoviesByGenre(null, { genreId: genre1._id.toString() });
        result.forEach((movie) => {
          // Tests that all movies in the result array has the same and correct genre
          expect(movie.genre_ids.map((genre) => genre._id)).toContain(genre1._id);
        });
      });

      it('should return movies with the same genre and the same genre only', async () => {
        const result = await movieQuery.getMoviesByGenre(null, { genreId: genre1._id.toString() });
        expect(result).toHaveLength(collectionLength / 2);

        const result2 = await movieQuery.getMoviesByGenre(null, { genreId: genre2._id.toString() });
        expect(result2).toHaveLength(collectionLength / 2);

        // Should not return any movies since there are no movies with genreId 17
        const result3 = await movieQuery.getMoviesByGenre(null, { genreId: '17' });
        expect(result3).toHaveLength(0);
      });

      it('should return maximum 16 movies for each query', async () => {
        // Adds 10 movies with the same genre to test that the query returns maximum 16 movies
        const movies = Array.from({ length: 10 }, (_, i) => ({
          _id: (i + 19).toString(),
          title: `DELETE THIS`,
          genre_ids: [genre1._id],
          overview: 'A test movie',
          release_date: '2023-01-01',
        }));

        await seedMovies(movies);

        const result = await movieQuery.getMoviesByGenre(null, { genreId: genre1._id.toString() });

        // Tests that the query returns maximum 16 movies
        expect(result.length).toBe(pageSize);

        // Cleanup
        await Movie.deleteMany({ title: 'DELETE THIS' });
      });
    });

    describe('getMoviesByTitleAZ', () => {
      it('should return the right amount of movies when sorted alphabetically/reversed alphabetically', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 1, order: 'a-z' });
        expect(firstPageResults).toHaveLength(pageSize);

        // Test the second page
        const secondPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 2, order: 'a-z' });
        expect(secondPageResults).toHaveLength(collectionLength - pageSize);

        // Tests the reversed order

        const firstPageResultsReversed = await movieQuery.getMoviesByTitleAZ(null, { page: 1, order: 'z-a' });
        expect(firstPageResultsReversed).toHaveLength(pageSize);

        const secondPageResultsReversed = await movieQuery.getMoviesByTitleAZ(null, { page: 2, order: 'z-a' });
        expect(secondPageResultsReversed).toHaveLength(collectionLength - pageSize);
      });

      it('should return the alphabetically sorted movies in the right order', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 1, order: 'a-z' });

        expect(firstPageResults).toHaveLength(pageSize);
        for (let i = 0; i < 16; i++) {
          expect(firstPageResults[i].title).toBe(`Test Movie ${letters[i]}`);
        }
        // Test the second page
        const secondPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 2, order: 'a-z' });
        expect(secondPageResults[0].title).toBe(`Test Movie ${letters[16]}`);
      });

      it('should return the reversed alphabetically sorted movies in the right order', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 1, order: 'z-a' });
        expect(firstPageResults).toHaveLength(pageSize);
        for (let i = 0; i < 16; i++) {
          expect(firstPageResults[i].title).toBe(`Test Movie ${letters[letters.length - 1 - i]}`);
        }
        // Test the second page
        const secondPageResults = await movieQuery.getMoviesByTitleAZ(null, { page: 2, order: 'z-a' });
        expect(secondPageResults[0].title).toBe(`Test Movie ${letters[letters.length - 16 - 1]}`);
      });

      // Assuming that if it works alphabetically, it works reversed alphabetically as well
      it('should return the sorted movies in the right order when filtered by genre', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByTitleAZ(null, {
          page: 1,
          order: 'a-z',
          genreId: genre1._id.toString(),
        });

        expect(firstPageResults).toHaveLength(collectionLength / 2);
        for (let i = 0; i < 9; i++) {
          expect(firstPageResults[i].title).toBe(`Test Movie ${letters[i]}`);
        }

        const secondPageResults = await movieQuery.getMoviesByTitleAZ(null, {
          page: 1,
          order: 'a-z',
          genreId: genre2._id.toString(),
        });

        expect(secondPageResults).toHaveLength(collectionLength / 2);
        const titles = secondPageResults.map((movie) => movie.title);
        const sortedTitles = secondPageResults.map((movie) => movie.title).sort(); // assumes that .sort() works
        expect(titles).toEqual(sortedTitles);
      });

      it('should return Error when order is not a-z or z-a', async () => {
        await expect(movieQuery.getMoviesByTitleAZ(null, { page: 1, order: 'a-m' })).rejects.toThrow(
          'Error while getting sorted movies by title: Error: Invalid order',
        );
      });
    });

    describe('getMoviesByRating', () => {
      it('should return the right amount of movies when sorted by rating ASC and DESC', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByRating(null, { page: 1, order: 'l-h' });
        expect(firstPageResults).toHaveLength(pageSize);

        // Test the second page
        const secondPageResults = await movieQuery.getMoviesByRating(null, { page: 2, order: 'l-h' });
        expect(secondPageResults).toHaveLength(collectionLength - pageSize);

        const firstPageResultsReversed = await movieQuery.getMoviesByRating(null, { page: 1, order: 'h-l' });
        expect(firstPageResultsReversed).toHaveLength(pageSize);

        const secondPageResultsReversed = await movieQuery.getMoviesByRating(null, { page: 2, order: 'h-l' });
        expect(secondPageResultsReversed).toHaveLength(collectionLength - pageSize);
      });

      it('should return the movies sorted by rating in the right order', async () => {
        // Test the first page
        const firstPageResults = await movieQuery.getMoviesByRating(null, { page: 1, order: 'l-h' });
        expect(firstPageResults).toHaveLength(pageSize);
        const ratingslist = firstPageResults.map((movie) => movie.vote_average);
        const filteredRatings = firstPageResults.map((movie) => movie.vote_average).sort((a, b) => a - b);
        expect(ratingslist).toEqual(filteredRatings);

        // Test the second page
        const secondPageResults = await movieQuery.getMoviesByRating(null, { page: 2, order: 'l-h' });
        expect(secondPageResults).toHaveLength(collectionLength - pageSize);
        expect(secondPageResults[0].vote_average).toBe(ratings[16]);
      });

      it('should return Error when order is not l-h or h-l', async () => {
        await expect(movieQuery.getMoviesByRating(null, { page: 1, order: 'l-m' })).rejects.toThrow(
          'Error while getting sorted movies by rating: Error: Invalid order',
        );
      });
    });
  });
});
