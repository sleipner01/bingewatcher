import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router';

import { Spinner } from '../components/loading/Loading';
import { MovieDetails } from '../components/movieDetails/MovieDetails';
import { useUser } from '../context/UserContext';
import { GET_MOVIE } from '../graphql/queries';

export const Movie = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? parseInt(idParam) : undefined;

  const { user } = useUser();

  const { data, loading, error } = useQuery(GET_MOVIE, {
    variables: { id: id, userId: user?.id },
  });

  if (loading) return <Spinner width='100%' height='400px' />;

  if (error || !data)
    return <div style={{ color: 'var(--color-text)' }}>Something went wrong while fetching movie details...</div>;

  return <MovieDetails movie={data.getMovieById} />;
};
