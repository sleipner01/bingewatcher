import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { Movie } from '../../types';
import { getCategoryById } from '../../utils/categoryUtils';
import WatchlistButton from '../watchlistButton/WatchlistButton';
import styles from './MovieCard.module.scss';

interface MovieProps {
  movie: Movie;
}

/**
 *
 * MovieCard component.
 * Takes values from parameters and displays them in an organized card.
 *
 * @param movie
 * @returns {React.JSX.Element}
 */

export const MovieCard: FC<MovieProps> = ({ movie }) => {
  const userContext = useUser();
  const { user } = userContext;

  return (
    <Card className={styles.card} data-testid='movie-card'>
      <Link to={`/movie/${movie._id}`} state={movie} className={styles.link}>
        <CardMedia
          component='img'
          image={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title + ' poster.'}
          className='movie-card-image'
        />
        <CardContent>
          <Typography gutterBottom component='div' aria-label={`title: ${movie.title}.`}>
            {movie.title}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            aria-label={`genres:${movie.genre_ids.map((genre) => getCategoryById(genre)?.name)}`}
          >
            {movie.genre_ids.map((genre) => getCategoryById(genre)?.name).join(', ')}
          </Typography>
        </CardContent>
      </Link>
      {user && <WatchlistButton movie={movie} user={user} />}
    </Card>
  );
};
