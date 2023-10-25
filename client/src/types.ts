export interface User {
  name: string;
  ratings: Rating[];
  watchlist?: Movie[];
}

/**
 * The Movie type is based on the API response from
 * https://developers.themoviedb.org/3/movies/get-popular-movies
 * The API response is a bit more complex, but we only need these fields.
 */
export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * The Category type is based on the API response from
 * https://developers.themoviedb.org/3/genres/get-movie-list
 */
export interface Category {
  id: number;
  name: string;
}

export interface Rating {
  movieId: number;
  rating: number;
}