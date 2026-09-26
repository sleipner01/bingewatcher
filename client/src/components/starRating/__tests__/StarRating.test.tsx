import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ADD_RATING, GET_MOVIE_RATING_WITH_USERID } from '../../../graphql/queries';
import { User } from '../../../types';
import { renderWithProviders } from '../../../utils/testUtils';
import { StarRating } from '../StarRating';

// Define mockUser
const mockUser: User = {
  id: '123',
  name: 'Test User',
  loginState: true,
};

const mocks = [
  {
    request: {
      query: GET_MOVIE_RATING_WITH_USERID,
      variables: {
        userID: mockUser.id,
        movieID: 1,
      },
    },
    result: {
      data: {
        getMovieRatingWithUserID: {
          rating: 8,
        },
      },
    },
  },
  {
    request: {
      query: ADD_RATING,
      variables: {
        userID: mockUser.id,
        movieID: 1,
        rating: 5,
      },
    },
    result: {
      data: {
        addRating: {
          rating: 5,
        },
      },
    },
  },
  {
    request: {
      query: GET_MOVIE_RATING_WITH_USERID,
      variables: {
        userID: mockUser.id,
        movieID: 1,
      },
    },
    result: {
      data: {
        getMovieRatingWithUserID: {
          rating: 5,
        },
      },
    },
  },
];

describe('StarRating', () => {
  it('should match snapshot', async () => {
    const { container } = renderWithProviders({
      child: <StarRating movieId={1} user={mockUser} />,
      mocks: mocks,
    });
    await waitFor(() => screen.getByText('8 of 10 stars'));
    expect(container).toMatchSnapshot();
  });

  it('updates the rating when a star is clicked', async () => {
    renderWithProviders({ child: <StarRating movieId={1} user={mockUser} />, mocks: mocks });
    const ratingElement = screen.getByLabelText('5 Stars');
    fireEvent.click(ratingElement);
    expect(await screen.findByText('5 of 10 stars')).toBeTruthy();
  });
});
