import Movie from '../models/Movie.js';
import Watchlist from '../models/Watchlist.js';

const pageSize = 16;

const movieResolver = {
  Query: {
    // Return the 16 first movies
    async getMovies(_, { page }) {
      try {
        const skip = (page - 1) * pageSize;
        return await Movie.find().skip(skip).limit(pageSize).populate('genre_ids');
      } catch (error) {
        throw new Error('Error while getting movies: ' + error);
      }
    },

    async getMovieById(_, { id }) {
      try {
        return await Movie.findById(id).populate('genre_ids');
      } catch (error) {
        throw new Error('Error while getting movie: ' + error);
      }
    },
    async getMovieByTitle(_, { title }) {
      try {
        return await Movie.findOne({ title }).populate('genre_ids');
      } catch (error) {
        throw new Error('Error while getting movie: ' + error);
      }
    },
    async getMoviesByTitle(_, { title, limit, offset }) {
      try {
        // Includes movies that contains the searchexpression
        const regexSearch = new RegExp(title, 'i');

        // Includes movies that starts with the searchexpression
        const regexStartsWith = new RegExp('^' + title, 'i');

        // Sorts the movies that starts with the searchexpression first
        const movies = await Movie.aggregate([
          {
            $match: {
              title: { $regex: regexSearch },
            },
          },
          {
            $addFields: {
              startsWith: {
                $cond: [{ $regexMatch: { input: '$title', regex: regexStartsWith } }, 1, 0],
              },
            },
          },
          {
            $sort: {
              startsWith: -1,
              title: 1,
            },
          },

          { $skip: offset },
          { $limit: limit },
        ]);

        return movies;
      } catch (error) {
        throw new Error('Error while getting movies: ' + error);
      }
    },
    async getMoviesByGenre(_, { page, genreId }) {
      try {
        const skip = (page - 1) * pageSize;

        // Filter movies based on the provided genreId
        const genreIdNumber = parseInt(genreId, 10);

        return await Movie.find({ genre_ids: genreIdNumber }).skip(skip).limit(pageSize).populate('genre_ids');
      } catch (error) {
        throw new Error('Error while getting movies by genre: ' + error);
      }
    },
    async getMovieCountByGenre(_, { genreId }) {
      try {
        // If no genreId is provided, return the total number of movies
        if (!genreId) return await Movie.countDocuments();

        // If genreId is provided, return the number of movies with the provided genreId
        const genreIdNumber = parseInt(genreId, 10);
        return await Movie.countDocuments({ genre_ids: genreIdNumber });
      } catch (error) {
        throw new Error('Error while getting movie count by genre: ' + error);
      }
    },
    // Sorts movies alphabetically, with page
    async getMoviesByTitleAZ(_, { page, genreId, order }) {
      try {
        const skip = (page - 1) * pageSize;

        let sortOrder = 0;
        if (order === 'a-z') sortOrder = 1;
        else if (order === 'z-a') sortOrder = -1;
        else throw new Error('Invalid order');

        if (genreId) {
          const genreIdNumber = parseInt(genreId, 10);
          return await Movie.find({ genre_ids: genreIdNumber })
            .sort({ title: sortOrder })
            .skip(skip)
            .limit(pageSize)
            .populate('genre_ids');
        } else {
          return await Movie.find().sort({ title: sortOrder }).skip(skip).limit(pageSize).populate('genre_ids');
        }
      } catch (error) {
        throw new Error('Error while getting sorted movies by title: ' + error);
      }
    },
    // Sort movies based on the field "vote_average", ascending and descending, with page
    async getMoviesByRating(_, { page, genreId, order }) {
      try {
        const skip = (page - 1) * pageSize;

        let sortOrder = 0;
        if (order === 'l-h') sortOrder = 1;
        else if (order === 'h-l') sortOrder = -1;
        else throw new Error('Invalid order');

        if (genreId) {
          const genreIdNumber = parseInt(genreId, 10);
          return await Movie.find({ genre_ids: genreIdNumber })
            .sort({ vote_average: sortOrder })
            .skip(skip)
            .limit(pageSize)
            .populate('genre_ids');
        } else {
          return await Movie.find().sort({ vote_average: sortOrder }).skip(skip).limit(pageSize).populate('genre_ids');
        }
      } catch (error) {
        throw new Error('Error while getting sorted movies by rating: ' + error);
      }
    },
  },
  Movie: {
    isInWatchlist: async (movie, { userID }) => {
      try {
        const movieID = movie._id;
        try {
          // Finds the watchlist for the given userID
          const watchlist = await Watchlist.findOne({ userID: userID });

          // If user doesn't exist, return false
          if (!watchlist) {
            return false;
          }

          // Returns true if the movieID is in the watchlist
          return watchlist.movies.includes(movieID);
        } catch (error) {
          console.error(error);
          throw new Error('Error checking if movie is in watchlist');
        }
      } catch (error) {
        throw new Error('Error while adding movie to watchlist: ' + error);
      }
    },
  },
};

export default movieResolver;
