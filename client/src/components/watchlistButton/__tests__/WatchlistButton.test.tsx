import { fireEvent, screen } from '@testing-library/react';

import { ADD_MOVIE_TO_WATCHLIST, REMOVE_MOVIE_FROM_WATCHLIST } from '../../../graphql/queries';
import { Movie, User } from '../../../types';
import { renderWithProviders } from '../../../utils/testUtils';
import WatchlistButton from '../WatchlistButton';

const mockUser: User = {
  id: '1234567890',
  name: 'Foo Bar',
  loginState: true,
};

const mockMovie: Movie = {
  adult: false,
  backdrop_path: '/mockBackdropURL.jpg',
  genre_ids: [
    {
      _id: 12,
      name: 'Adventure',
    },
    {
      _id: 28,
      name: 'Action',
    },
  ],
  _id: 111111,
  original_language: 'en',
  original_title: 'Foo Bar',
  overview: 'Simple mock overview',
  popularity: 1000,
  poster_path: '/mockPosterURL.jpg',
  release_date: '1970-01-01',
  title: 'Foo Bar',
  video: false,
  vote_average: 5,
  vote_count: 555,
  isInWatchlist: true,
};

describe('WatchlistButton', () => {
  it('Should match snapshot when movie is in watchlist', () => {
    const { container } = renderWithProviders({
      child: <WatchlistButton movie={mockMovie} user={mockUser} />,
    });
    expect(container).toMatchSnapshot();
  });

  it('Should match snapshot when movie is not in watchlist', () => {
    const { container } = renderWithProviders({
      child: <WatchlistButton movie={{ ...mockMovie, isInWatchlist: false }} user={mockUser} />,
    });
    expect(container).toMatchSnapshot();
  });

  it('Should match snapshot when style prop is big', () => {
    const { container } = renderWithProviders({
      child: <WatchlistButton movie={mockMovie} user={mockUser} style='big' />,
    });
    expect(container).toMatchSnapshot();
  });

  it('Should render a small button by default', () => {
    const { container } = renderWithProviders({
      child: <WatchlistButton movie={mockMovie} user={mockUser} />,
    });
    expect(container.querySelector('.smallContainer')).toBeDefined();
  });

  it('Should call removeWatchlist mutation when button is clicked and movie is not in watchlist', async () => {
    const mocks = [
      {
        request: {
          query: REMOVE_MOVIE_FROM_WATCHLIST,
          variables: {
            movieId: 111111,
            userId: mockUser.id,
          },
        },
        result: {
          data: {
            removeMovieFromWatchlist: {
              userID: mockUser.id,
              movies: [],
            },
          },
        },
      },
    ];
    renderWithProviders({ child: <WatchlistButton movie={mockMovie} user={mockUser} />, mocks: mocks });

    expect(screen.getByRole('button').querySelector('.remove')).toBeDefined();
    expect(screen.getByRole('button').querySelector('.add')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').querySelector('.add')).toBeDefined();
    expect(screen.getByRole('button').querySelector('.remove')).toBeNull();
  });

  it('Should call addWatchlist mutation when button is clicked and movie is not in watchlist', async () => {
    const mocks = [
      {
        request: {
          query: ADD_MOVIE_TO_WATCHLIST,
          variables: {
            movieId: 111111,
            userId: mockUser.id,
          },
        },
        result: {
          data: {
            addMovieToWatchlist: {
              userID: mockUser.id,
              movies: [mockMovie],
            },
          },
        },
      },
    ];

    renderWithProviders({
      child: <WatchlistButton movie={{ ...mockMovie, isInWatchlist: false }} user={mockUser} />,
      mocks: mocks,
    });

    expect(screen.getByRole('button').querySelector('.add')).toBeDefined();
    expect(screen.getByRole('button').querySelector('.remove')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').querySelector('.remove')).toBeDefined();
    expect(screen.getByRole('button').querySelector('.add')).toBeNull();
  });
});
