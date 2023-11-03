import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
  query getMovies($page: Int!) {
    getMovies(page: $page) {
      _id
      genre_ids
      poster_path
      title
    }
  }
`;

export const GET_MOVIES_BY_GENRE = gql`
  query getMoviesByGenre($page: Int!, $genreId: Int!) {
    getMoviesByGenre(page: $page, genreId: $genreId) {
      _id
      genre_ids
      poster_path
      title
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_TITLE_AZ = gql`
  query getMoviesByTitleAZ($page: Int!, $order: String!, $genreId: Int) {
    getMoviesByTitleAZ(page: $page, order: $order, genreId: $genreId) {
      _id
      genre_ids
      poster_path
      title
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_RATING = gql`
  query getMoviesByRating($page: Int!, $order: String!, $genreId: Int) {
    getMoviesByRating(page: $page, order: $order, genreId: $genreId) {
      _id
      genre_ids
      poster_path
      title
    }
    getMovieCountByGenre(genreId: $genreId)
  }
`;

export const GET_MOVIES_BY_TITLE = gql`
  query getMoviesByTitle($title: String!, $limit: Int!) {
    getMoviesByTitle(title: $title, limit: $limit) {
      _id
      title
    }
  }
`;

export const determineQueryAndVariables = (
  page: number,
  genre: string,
  alphabeticalSort: string,
  ratingSort: string,
) => {
  const baseVariables = { page: page };

  if (genre) {
    if (alphabeticalSort) {
      return {
        query: GET_MOVIES_BY_TITLE_AZ,
        variables: { ...baseVariables, genreId: genre, order: alphabeticalSort },
      };
    }
    if (ratingSort) {
      return {
        query: GET_MOVIES_BY_RATING,
        variables: { ...baseVariables, genreId: genre, order: ratingSort },
      };
    }
    return {
      query: GET_MOVIES_BY_GENRE,
      variables: { ...baseVariables, genreId: genre },
    };
  }

  if (alphabeticalSort) {
    return {
      query: GET_MOVIES_BY_TITLE_AZ,
      variables: { ...baseVariables, order: alphabeticalSort },
    };
  }
  if (ratingSort) {
    return {
      query: GET_MOVIES_BY_RATING,
      variables: { ...baseVariables, order: ratingSort },
    };
  }

  return {
    query: GET_MOVIES,
    variables: baseVariables,
  };
};