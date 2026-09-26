import { gql, TypedDocumentNode } from '@apollo/client';

import { Genre, Movie } from '../types';

export interface MoviesPageData {
  getMovies?: Movie[];
  getMoviesByGenre?: Movie[];
  getMoviesByTitleAZ?: Movie[];
  getMoviesByRating?: Movie[];
  getMovieCountByGenre: number;
}

export interface MovieSearchResult {
  _id: string;
  title: string;
}

interface WatchlistMutationData {
  userID: string;
  movies: Pick<Movie, '_id'>[];
}

export const GET_MOVIES: TypedDocumentNode<MoviesPageData> = gql`
  query getMovies($page: Int!, $userId: String) {
    getMovies(page: $page, userID: $userId) {
      _id
      genre_ids {
        _id
        name
      }
      poster_path
      title
      isInWatchlist(userID: $userId)
    }
    getMovieCountByGenre(genreId: null)
  }
`;

export const GET_MOVIE: TypedDocumentNode<{ getMovieById: Movie }> = gql`
  query getMovieById($id: Int!, $userId: String) {
    getMovieById(id: $id) {
      _id
      backdrop_path
      genre_ids {
        _id
        name
      }
      overview
      popularity
      release_date
      title
      vote_average
      vote_count
      isInWatchlist(userID: $userId)
    }
  }
`;

export const GET_MOVIES_BY_GENRE: TypedDocumentNode<MoviesPageData> = gql`
  query getMoviesByGenre($page: Int!, $genreId: Int!, $userId: String!) {
    getMoviesByGenre(page: $page, genreId: $genreId) {
      _id
      genre_ids {
        _id
        name
      }
      poster_path
      title
      isInWatchlist(userID: $userId)
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_TITLE_AZ: TypedDocumentNode<MoviesPageData> = gql`
  query getMoviesByTitleAZ($page: Int!, $order: String!, $genreId: Int, $userId: String) {
    getMoviesByTitleAZ(page: $page, order: $order, genreId: $genreId) {
      _id
      genre_ids {
        _id
        name
      }
      isInWatchlist(userID: $userId)
      poster_path
      title
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_RATING: TypedDocumentNode<MoviesPageData> = gql`
  query getMoviesByRating($page: Int!, $order: String!, $genreId: Int, $userId: String) {
    getMoviesByRating(page: $page, order: $order, genreId: $genreId) {
      _id
      genre_ids {
        _id
        name
      }
      poster_path
      title
      isInWatchlist(userID: $userId)
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_TITLE: TypedDocumentNode<{ getMoviesByTitle: MovieSearchResult[] }> = gql`
  query getMoviesByTitle($title: String!, $limit: Int!, $offset: Int!) {
    getMoviesByTitle(title: $title, limit: $limit, offset: $offset) {
      _id
      title
    }
  }
`;

export const REMOVE_MOVIE_FROM_WATCHLIST: TypedDocumentNode<{ removeMovieFromWatchlist: WatchlistMutationData }> = gql`
  mutation Mutation($userId: String!, $movieId: Int!) {
    removeMovieFromWatchlist(userID: $userId, movieID: $movieId) {
      userID
      movies {
        _id
      }
    }
  }
`;

export const ADD_MOVIE_TO_WATCHLIST: TypedDocumentNode<{ addMovieToWatchlist: WatchlistMutationData }> = gql`
  mutation Mutation($userId: String!, $movieId: Int!) {
    addMovieToWatchlist(userID: $userId, movieID: $movieId) {
      userID
      movies {
        _id
      }
    }
  }
`;

export const GET_WATCHLIST_BY_USER_ID: TypedDocumentNode<{
  getWatchlistByUserID: { userID: string; movies: Movie[] };
  getWatchlistCountByUserID: number;
}> = gql`
  query Query($userId: String!, $page: Int!) {
    getWatchlistByUserID(userID: $userId, page: $page) {
      userID
      movies {
        _id
        title
        genre_ids {
          _id
          name
        }
        poster_path
        isInWatchlist(userID: $userId)
      }
    }
    getWatchlistCountByUserID(userID: $userId)
  }
`;

export const GET_MOVIE_RATING_WITH_USERID: TypedDocumentNode<{ getMovieRatingWithUserID: { rating: number } }> = gql`
  query getMovieRatingWithUserID($userID: String!, $movieID: Int!) {
    getMovieRatingWithUserID(userID: $userID, movieID: $movieID) {
      rating
    }
  }
`;

export const ADD_RATING: TypedDocumentNode<{ addRating: { rating: number } }> = gql`
  mutation addRating($userID: String!, $movieID: Int!, $rating: Float!) {
    addRating(userID: $userID, movieID: $movieID, rating: $rating) {
      rating
    }
  }
`;

export const GET_GENRES: TypedDocumentNode<{ getGenres: Genre[] }> = gql`
  query getGenres {
    getGenres {
      _id
      name
    }
  }
`;

export const GET_FILTER = gql`
  query FilterData {
    filter @client {
      sort
      genre
      page
    }
  }
`;
