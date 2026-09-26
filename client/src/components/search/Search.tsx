import { useQuery } from '@apollo/client/react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { GET_MOVIES_BY_TITLE, MovieSearchResult } from '../../graphql/queries';
import styles from './Search.module.scss';

/**
 *
 * Search component.
 *
 * Displays a search bar that filters movies by title.
 *
 * @returns {React.JSX.Element}
 *
 */
export const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(20);
  const [tabIndex, setTabIndex] = useState<number>(1);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [hideLoadMore, setHideLoadMore] = useState<boolean>(false);

  const [offset, setOffset] = useState<number>(0);
  const movieFetchLimit = 20;

  const movieRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Use useEffect to debounce search term after user input to prevent too many queries
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim()); // Trim when updating debounced term
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Use useQuery to fetch movies by title
  const { data, fetchMore } = useQuery(GET_MOVIES_BY_TITLE, {
    variables: { title: debouncedSearchTerm, limit: movieFetchLimit, offset: 0 },
    skip: !debouncedSearchTerm, // Skips the query if searchTerm is empty
  });
  const movies = data?.getMoviesByTitle ?? [];

  useEffect(() => {
    movieRefs.current = movieRefs.current.slice(0, data?.getMoviesByTitle.length);
  }, [data]);

  // Loads the next 20 movies when user scrolls to the bottom of the dropdown and clicks the load more button
  const loadMoreMovies = async () => {
    const newOffset = offset + movieFetchLimit;
    setOffset(newOffset);
    await fetchMore({
      variables: { limit: movieFetchLimit, offset: newOffset },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult?.getMoviesByTitle?.length === 0) setHideLoadMore(true);
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          getMoviesByTitle: [...prev.getMoviesByTitle, ...fetchMoreResult.getMoviesByTitle],
        });
      },
    });
    setTimeout(() => {
      movieRefs.current[newOffset]?.focus();
    }, 0);
  };

  // Use useCallback to prevent to many rerenders
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    setLimit(20);
    setTabIndex(1);
  }, []);

  // Use useCallback to prevent to many rerenders
  const handleMovieSelect = useCallback(
    (movie: MovieSearchResult) => {
      void navigate(`/movie/${movie._id}`);
      setIsDropdownOpen(false);
      setSearchTerm('');
    },
    [navigate],
  );

  // Use useEffect to close dropdown when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as Node).contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, movie?: MovieSearchResult) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        setTabIndex(tabIndex - 1);
        return;
      }
      setTabIndex(tabIndex + 1);
      if (data && movies.length < limit && tabIndex === movies.length) {
        setIsDropdownOpen(false);
      }
    }
    if (e.key === 'Enter' && movie) {
      handleMovieSelect(movie);
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={styles.searchBar} data-testid='searchbar-container'>
      <TextField
        id='searchBar'
        variant='outlined'
        placeholder='Search by title...'
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e, movies[0])}
        className={styles.searchInput}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Dropdown of filtered movies */}
      {data?.getMoviesByTitle.length === 0 && isDropdownOpen && data && searchTerm.length > 0 && (
        <ul className={styles.dropdown} ref={dropdownRef}>
          <li id={styles.notFound}>No results found for {`"${searchTerm}"`}</li>
        </ul>
      )}
      {movies.length > 0 && isDropdownOpen && (
        <ul className={styles.dropdown} ref={dropdownRef} tabIndex={0} aria-label='Search result for movie title'>
          {movies.map((movie, index) => (
            <li
              key={movie._id}
              ref={(e) => {
                movieRefs.current[index] = e;
              }}
              className={styles.movie}
              tabIndex={0}
              onClick={() => handleMovieSelect(movie)}
              onKeyDown={(e) => handleKeyDown(e, movie)}
              aria-label={`Movie: ${movie.title}`}
            >
              {movie.title}
            </li>
          ))}
          {movies.length % 20 === 0 && !hideLoadMore && (
            <li
              className={styles.loadMore}
              onClick={loadMoreMovies}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void loadMoreMovies();
                  setTabIndex(1);
                } else if (e.key === 'Tab' && !e.shiftKey) {
                  setIsDropdownOpen(false);
                } else if (e.key == 'Tab' && e.shiftKey) {
                  setTabIndex(tabIndex - 1);
                }
              }}
            >
              Load more movies...
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
