import ArrowBack from '@mui/icons-material/ArrowBack';
import LiveTv from '@mui/icons-material/LiveTv';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import Star from '@mui/icons-material/Star';
import { FC, useEffect } from 'react';
import { Link } from 'react-router';

import { useUser } from '../../context/useUser';
import { Genre, Movie } from '../../types';
import { StarRating } from '../starRating/StarRating';
import WatchlistButton from '../watchlistButton/WatchlistButton';
import styles from './MovieDetails.module.scss';

interface MovieDetailsProps {
  movie: Movie;
}

/**
 *
 * MovieDetails component.
 * Takes all values from parameters and displays them in an organized page.
 *
 * @param movie
 * @returns {React.JSX.Element}
 */

export const MovieDetails: FC<MovieDetailsProps> = ({ movie }) => {
  const { user } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.movieDetails}>
      <Link to='/' className={styles.goBack} aria-label='link back to movie page' id={'scroll-to-top-focus'}>
        <ArrowBack /> <span>Movies</span>
      </Link>
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt={movie.title + ' backdrop poster'}
        className={styles.backdropPoster}
        loading='lazy'
      />
      <div className={styles.container}>
        <h1 tabIndex={-1}>
          {movie.title} ({movie.release_date.split('-')[0]})
        </h1>
        {user && <WatchlistButton movie={movie} style={'big'} user={user} />}
        <p className={styles.date} tabIndex={0}>
          {movie.release_date} - {movie.genre_ids.map((genre: Genre) => genre.name).join(', ')}
        </p>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.subtitle} tabIndex={0}>
              About:
            </h2>
            <p className={styles.overview} tabIndex={0}>
              {movie.overview}
            </p>
          </div>
          <h2 className={styles.subtitle} tabIndex={0}>
            Statistics:
          </h2>
          <div className={styles.details}>
            <div className={styles.detail}>
              <div
                className={styles.score}
                tabIndex={0}
                aria-label={`Average rating by other users: ${movie.vote_average} out of 10`}
              >
                {movie.vote_average.toFixed(1)} / 10
                <div>
                  <Star fontSize='inherit' />
                </div>
              </div>
              <p>Avg. Rating</p>
            </div>
            <div className={styles.detail}>
              <div
                className={styles.score}
                data-testid='vote-count'
                tabIndex={0}
                aria-label={`Amount of votes: ${movie.vote_count}`}
              >
                {movie.vote_count}
                <div>
                  <PeopleAlt fontSize='inherit' />
                </div>
              </div>
              <p>Vote Count</p>
            </div>
            <div className={styles.detail}>
              <div className={styles.score} tabIndex={0} aria-label={`Popularity: ${movie.popularity}`}>
                {movie.popularity}
                <div>
                  <LiveTv fontSize='inherit' />
                </div>
              </div>
              <p>Popularity</p>
            </div>
          </div>
        </div>
        {user && <StarRating movieId={movie._id} user={user} />}
      </div>
    </div>
  );
};
