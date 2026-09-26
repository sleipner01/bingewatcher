import { useQuery } from '@apollo/client/react';
import { Pagination } from '@mui/material';
import { useEffect, useState } from 'react';

import { FilterSort } from '../components/filterSort/FilterSort';
import { Spinner } from '../components/loading/Loading';
import { MovieList } from '../components/movieList/MovieList';
import { Search } from '../components/search/Search';
import { useUser } from '../context/UserContext';
import { getCachedFilterValues, setCachedFilterValues } from '../graphql/cachedFilterValues';
import { Sort } from '../types';
import { determineQueryAndVariables } from '../utils/moviesUtils';
import styles from './Movies.module.scss';

/**
 *
 * Movies component.
 * Displays a list of movies with pagination and filtering.
 *
 * @returns {React.JSX.Element}
 */
export const Movies = () => {
  // Retrieving cached filter values to prefill the filter form
  const { sort: cachedSort, genre: cachedGenre, page: cachedPage } = getCachedFilterValues();

  const sizeLimit = 16;

  const userContext = useUser();
  const { user } = userContext;

  const [count, setCount] = useState<number | undefined>(sizeLimit);
  const [page, setPage] = useState(cachedPage);
  const [genre, setGenre] = useState(cachedGenre);
  const [sort, setSort] = useState<Sort>(cachedSort);

  const handlePagination = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setCachedFilterValues({ sort, genre, page: value });
  };

  // Creating the query and variables based on the filter values
  const { query, variables } = determineQueryAndVariables(page, genre, sort, user?.id || '');

  const { data, loading, error } = useQuery(query, {
    variables: variables,
  });

  useEffect(() => {
    if (data && data.getMovieCountByGenre) {
      setCount(data.getMovieCountByGenre);
    } else {
      setCount(undefined);
    }
  }, [data]);

  const movies = data?.getMovies || data?.getMoviesByGenre || data?.getMoviesByRating || data?.getMoviesByTitleAZ || [];

  const startMovie = (page - 1) * sizeLimit + 1;
  const endMovie = Math.min(page * sizeLimit, count || 0);

  return (
    <>
      {/* Create headerelement with h1 inside */}
      <Search />
      <header className={styles.heading}>
        <h1>Movies</h1>
        <Pagination
          count={Math.ceil((count || sizeLimit) / sizeLimit)}
          page={page}
          onChange={handlePagination}
          color='primary'
          size='small'
          className={styles.paginationTop}
        />
      </header>
      {count && (
        <p className={styles.count} tabIndex={0}>
          Showing {startMovie}-{endMovie} movies of {count} total
        </p>
      )}
      <br />
      <FilterSort genre={genre} sort={sort} setGenre={setGenre} setPage={setPage} setSort={setSort} />
      {loading && <Spinner width='100%' height='500px' />}
      {error && <p>Something went wrong while fetching movies.</p>}
      {data && !loading && (
        <>
          {movies.length === 0 && <p className={styles.noMovies}>No movies found</p>}
          <MovieList movies={movies} />
          <Pagination
            count={Math.ceil((count || sizeLimit) / sizeLimit)}
            page={page}
            onChange={handlePagination}
            color='primary'
            size='large'
            data-testid='pagination-container'
            className={styles.paginationBottom}
          />
        </>
      )}
    </>
  );
};
