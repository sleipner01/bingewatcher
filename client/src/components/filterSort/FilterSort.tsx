import { useQuery } from '@apollo/client/react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { FC } from 'react';

import { setCachedFilterValues } from '../../graphql/cachedFilterValues';
import { GET_GENRES } from '../../graphql/queries';
import { Genre, Sort } from '../../types';
import styles from './FilterSort.module.scss';

interface FilterSortProps {
  genre: string;
  sort: Sort;
  setGenre: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSort: React.Dispatch<React.SetStateAction<'' | 'a-z' | 'z-a' | 'h-l' | 'l-h'>>;
}

/**
 * FilterSort
 *
 * Component to handle filtering and sorting by setting states of the parent component.
 * It also sets the cached filter values in the apollo cache.
 *
 * @param {FilterSortProps} props
 * @returns {React.FC}
 */
export const FilterSort: FC<FilterSortProps> = ({ genre, sort, setGenre, setSort, setPage }) => {
  const { data } = useQuery(GET_GENRES);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setGenre(event.target.value as string);
    setPage(1);
    setCachedFilterValues({ sort, genre: event.target.value as string, page: 1 });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSort(event.target.value as Sort);
    setPage(1);
    setCachedFilterValues({ sort: event.target.value as Sort, genre, page: 1 });
  };

  const handleReset = () => {
    setGenre('');
    setSort('');
    setPage(1);
    setCachedFilterValues({ sort: '', genre: '', page: 1 });
  };

  return (
    <div className={styles.filter} data-testid='filter-container'>
      <p>Filter:</p>

      <FormControl variant='filled' className={styles.categorySelect}>
        <InputLabel id='category'>Category</InputLabel>
        <Select id='category' value={genre} onChange={handleCategoryChange} data-testid='category-filter'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {data?.getGenres?.map((genre: Genre) => (
            <MenuItem key={genre._id} value={genre._id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <p>Sort:</p>
      <div className={styles.sort}>
        <FormControl variant='filled' className={styles.categorySelect}>
          <InputLabel id='sort'>Sort</InputLabel>
          <Select id='sort' value={sort} onChange={handleSortChange} data-testid='sort'>
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem key={'a-z'} value={'a-z'}>
              A-Z
            </MenuItem>
            <MenuItem key={'z-a'} value={'z-a'}>
              Z-A
            </MenuItem>
            <MenuItem key={'h-l'} value={'h-l'}>
              Rating: High to Low
            </MenuItem>
            <MenuItem key={'l-h'} value={'l-h'}>
              Rating: Low to High
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {(genre || sort) && (
        <Button onClick={handleReset} variant='outlined' data-testid='reset-filter-button'>
          Reset Filter
        </Button>
      )}
    </div>
  );
};
