import { useMutation, useQuery } from '@apollo/client/react';
import Rating from '@mui/material/Rating';
import { FC } from 'react';

import { ADD_RATING, GET_MOVIE_RATING_WITH_USERID } from '../../graphql/queries';
import { User } from '../../types';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  movieId: number;
  user: User;
}

/**
 * StarRating
 *
 * Component to handle rating movies.
 * It is connected to the UserContext to store the review for the user.
 *
 * @param {StarRatingProps} props
 */
export const StarRating: FC<StarRatingProps> = ({ movieId, user }) => {
  const MId: number = parseInt(movieId.toString()); // tmp fix because of data type mismatch

  const { data: ratingData, refetch } = useQuery(GET_MOVIE_RATING_WITH_USERID, {
    variables: { userID: user?.id, movieID: MId }, // Pass userID only if user exists
    fetchPolicy: 'cache-and-network', // Fetch data from cache and also make a network request to ensure data freshness
  });

  const [addRating] = useMutation(ADD_RATING, {
    // Update the cache after the mutation is executed successfully
    update(cache, { data }) {
      if (!data) return;

      // Refetch the rating query to get the latest data from the server
      refetch({ userID: user?.id, movieID: MId });

      // Update the ratingData in the cache with the new rating value
      cache.writeQuery({
        query: GET_MOVIE_RATING_WITH_USERID,
        variables: { userID: user?.id, movieID: MId },
        data: {
          getMovieRatingWithUserID: {
            ...ratingData?.getMovieRatingWithUserID, // Preserve existing data
            rating: data.addRating.rating, // Update the rating value
          },
        },
      });
      cache.modify({
        fields: {
          getMovieById(existingMovie) {
            if (existingMovie._id === MId) {
              return { ...existingMovie }; // Update the cache to reflect the change in the UI
            }
          },
        },
      });
    },
  });

  const handleRating = (rating: number | null) => {
    if (rating && user) {
      addRating({ variables: { userID: user.id, movieID: MId, rating: rating } });
    }
  };

  const fetchedRating = ratingData?.getMovieRatingWithUserID.rating || 0;

  return (
    <div className={styles.rating}>
      <h2 tabIndex={0}>Personal rating:</h2>
      <p tabIndex={0}>
        You can rate this movie by clicking on the stars below. Your rating will be saved to your account and is a great
        way to keep track of your favorite movies.
      </p>
      <h3 tabIndex={0}>
        Your selected rating: <span>{fetchedRating !== 0 ? fetchedRating + ' of 10 stars' : 'No rating selected'}</span>
      </h3>
      <Rating
        name='star-rating'
        getLabelText={(value: number) => `${value} Star${value !== 1 ? 's' : ''}`}
        precision={0.5}
        max={10}
        value={fetchedRating}
        data-testid='star-rating'
        onChange={(_event, newValue) => {
          handleRating(newValue);
        }}
        size='large'
      />
      <p className={styles.info}>Click on a star to select/change rating. The rating will be saved to your account.</p>
    </div>
  );
};
