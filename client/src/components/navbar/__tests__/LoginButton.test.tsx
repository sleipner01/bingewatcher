import { cleanup, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { User } from '../../../types';
import { renderWithProviders } from '../../../utils/testUtils';
import LoginButton from '../LoginButton';

const mockUser: User = {
  id: '1',
  name: 'Foo Bar',
  loginState: true,
};

describe('LoginButton', () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('Should match snapshot when logged inn', () => {
    const { container } = renderWithProviders({ child: <LoginButton />, mockUser: mockUser });
    expect(container).toMatchSnapshot();
  });

  it('Should match snapshot when logged out', () => {
    const { container } = renderWithProviders({ child: <LoginButton /> });
    expect(container).toMatchSnapshot();
  });

  it('Should render a login button when the user is not logged in', () => {
    renderWithProviders({ child: <LoginButton /> });
    expect(screen.getByText('Login')).toMatchSnapshot();
  });

  it('Should render the user name when the user is logged in', async () => {
    renderWithProviders({ child: <LoginButton />, mockUser: mockUser });
    expect(screen.getByText(mockUser.name)).toBeDefined();
  });

  it('Should render the menu when it is clicked', async () => {
    renderWithProviders({ child: <LoginButton />, mockUser: mockUser });
    fireEvent.click(screen.getByTestId('menu'));
    expect(screen.getByText('My Watchlist')).toBeDefined();
  });

  it('Should call login when clicking login', async () => {
    const login = vi.fn();
    renderWithProviders({ child: <LoginButton />, providerMocks: { loginMock: login } });
    expect(login).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Login'));
    expect(login).toHaveBeenCalled();
  });

  it('Should move to watchlist page', async () => {
    renderWithProviders({ child: <LoginButton />, mockUser: mockUser });

    fireEvent.click(screen.getByTestId('menu'));
    fireEvent.click(screen.getByText('My Watchlist'));

    expect(window.location.pathname).toBe('/watchlist');
  });

  it('Should log out when clicking logout', async () => {
    const logout = vi.fn();
    renderWithProviders({
      child: <LoginButton />,
      mockUser: mockUser,
      providerMocks: { logoutMock: logout },
    });
    expect(logout).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('menu'));
    fireEvent.click(screen.getByTestId('logout'));
    expect(logout).toHaveBeenCalled();
  });

  it('Should log out when clicking delete user', async () => {
    const delteUser = vi.fn();
    renderWithProviders({
      child: <LoginButton />,
      mockUser: mockUser,
      providerMocks: { deleteUserMock: delteUser },
    });
    expect(delteUser).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('menu'));
    fireEvent.click(screen.getByTestId('delete-user'));
    expect(delteUser).toHaveBeenCalled();
  });
});
