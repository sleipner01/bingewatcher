import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';

const ratingResolver = {
  Query: {
    async getMovieRatingWithUserID(_, { userID, movieID }) {
      // Find the user rating for the given userID and the given movieID in Rating.ratings
      try {
        const userRating = await Rating.findOne({ _id: userID });
        const rat = userRating.ratings.find((r) => r.movieID.toString() === movieID.toString());
        return { rating: rat.rating };
      } catch {
        return { rating: 0 };
      }
    },
  },
  Mutation: {
    addRating: async (_, { userID, movieID, rating }) => {
      try {
        if (rating < 0.5 || rating > 10) {
          throw new Error('Rating must be between 0 and 10');
        }

        const movieExists = await Movie.exists({ _id: movieID });
        if (!movieExists) {
          throw new Error('Movie does not exist');
        }
        const doc = await Movie.findById(movieID);
        let voteAvg = doc.vote_average;
        let voteCount = doc.vote_count;

        let userRating = await Rating.findOne({ _id: userID });

        if (!userRating) {
          // If the user doesn't exist, initialize a new userRating
          userRating = new Rating({ _id: userID, ratings: [] });
        }

        // Find the existing movie rating for the given movieID
        let movieRatingIndex = userRating.ratings.findIndex((r) => r.movieID.toString() === movieID.toString());

        if (movieRatingIndex !== -1) {
          // Update the existing rating if the movieID is found
          const previousRating = userRating.ratings[movieRatingIndex].rating;

          const newTotalRating = doc.vote_average * doc.vote_count - previousRating + rating;
          voteAvg = newTotalRating / doc.vote_count;
          userRating.ratings[movieRatingIndex].rating = rating;
        } else {
          // Otherwise, add a new rating entry
          userRating.ratings.push({ movieID: movieID, rating: rating });

          // Update Movie model with the new rating
          const newTotalRating = doc.vote_average * doc.vote_count + rating;
          voteCount += 1;
          voteAvg = newTotalRating / voteCount;
        }

        await userRating.save();
        await Movie.findByIdAndUpdate(movieID, { vote_average: voteAvg, vote_count: voteCount });

        return userRating.ratings.filter((r) => r.movieID.toString() === movieID.toString())[0];
      } catch (error) {
        throw new Error('Error while adding rating: ' + error);
      }
    },
  },
};

export default ratingResolver;
