import { useQuery } from '@apollo/client/react';
import { Pagination } from '@mui/material';
import { useState } from 'react';

import { Spinner } from '../components/loading/Loading';
import { MovieList } from '../components/movieList/MovieList';
import { useUser } from '../context/useUser';
import { GET_WATCHLIST_BY_USER_ID } from '../graphql/queries';
import styles from './Movies.module.scss';

/**
 *
 * Watchlist component.
 * Displays a list of movies in the user's watchlist with pagination.
 *
 * @returns {React.JSX.Element}
 */

export const Watchlist = () => {
  const sizeLimit = 16;
  const [page, setPage] = useState(1);
  const { user } = useUser();

  const handlePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const { data, loading, error } = useQuery(GET_WATCHLIST_BY_USER_ID, {
    variables: { userId: user?.id, page: page },
    fetchPolicy: 'network-only',
  });

  if (!user) {
    return (
      <>
        <h1 className={styles.heading}>Watchlist</h1>
        <p>You need to be logged in to see your watchlist.</p>
      </>
    );
  }

  if (loading) return <Spinner width='100%' height='300px' />;

  if (error || !data) return <p>Something went wrong fetching your watchlist.</p>;

  const length = data.getWatchlistCountByUserID;
  const count = Math.ceil(length / sizeLimit);

  if (length === 0)
    return (
      <>
        <h1 className={styles.heading}>Watchlist</h1>
        <p>
          No movies in your watchlist.
          <br />
          Add some to see them here.
        </p>
      </>
    );

  return (
    <>
      <header className={styles.heading}>
        <h1>Watchlist</h1>
        <Pagination
          count={Math.ceil((count || sizeLimit) / sizeLimit)}
          page={page}
          onChange={handlePagination}
          color='primary'
          size='small'
          className={styles.paginationTop}
        />
      </header>

      <MovieList movies={data.getWatchlistByUserID.movies} />
      <section className={styles.paginationBottom}>
        <Pagination count={count} page={page} onChange={handlePagination} color='primary' size='large' />
      </section>
    </>
  );
};
