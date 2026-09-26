import { fireEvent, render, waitFor } from '@testing-library/react';

import { UserProvider } from '../UserContext';
import { useUser } from '../useUser';

const TestingComponent = () => {
  const { user, setUser, login, logout, deleteUser, darkMode, toggleDarkMode } = useUser();
  return (
    <>
      <p data-testid='user-name'>{user?.name}</p>
      <p data-testid='user-id'>{user?.id}</p>
      <p data-testid='user-login-state'>{user?.loginState.toString()}</p>
      <p data-testid='dark-mode'>{darkMode.toString()}</p>
      <button data-testid='set-user' onClick={() => setUser({ name: 'test', id: 'test', loginState: true })}>
        Set User
      </button>
      <button data-testid='login' onClick={login}>
        Login
      </button>
      <button data-testid='logout' onClick={logout}>
        Logout
      </button>
      <button data-testid='delete-user' onClick={deleteUser}>
        Delete user
      </button>
      <button data-testid='toggle-dark-mode' onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </>
  );
};

describe('UserContext', () => {
  it('creates a user', async () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestingComponent />
      </UserProvider>,
    );
    expect(getByTestId('user-name').textContent).toHaveLength(0);
    fireEvent.click(getByTestId('login'));
    await waitFor(() => expect(getByTestId('user-name').textContent).not.toHaveLength(0));
  });

  it('sets a user', () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestingComponent />
      </UserProvider>,
    );
    fireEvent.click(getByTestId('set-user'));
    waitFor(() => expect(getByTestId('user-name').textContent).toBe('test'));
  });

  it('remembers the user when it logs in again', async () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestingComponent />
      </UserProvider>,
    );
    fireEvent.click(getByTestId('login'));
    await waitFor(() => expect(getByTestId('user-name').textContent).not.toHaveLength(0));
    const username = getByTestId('user-name').textContent;
    fireEvent.click(getByTestId('logout'));
    await waitFor(() => expect(getByTestId('user-name').textContent).toHaveLength(0));
    fireEvent.click(getByTestId('login'));
    await waitFor(() => expect(getByTestId('user-name').textContent).toBe(username));
  });

  it('deletes the user', async () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestingComponent />
      </UserProvider>,
    );
    fireEvent.click(getByTestId('login'));
    await waitFor(() => expect(getByTestId('user-name').textContent).not.toHaveLength(0));
    const username = getByTestId('user-name').textContent;
    fireEvent.click(getByTestId('delete-user'));
    await waitFor(() => expect(getByTestId('user-name').textContent).toHaveLength(0));
    fireEvent.click(getByTestId('login'));
    await waitFor(() => expect(getByTestId('user-name').textContent).not.toBe(username));
  });

  it('toggles dark mode', async () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestingComponent />
      </UserProvider>,
    );
    fireEvent.click(getByTestId('toggle-dark-mode'));
    await waitFor(() => expect(getByTestId('dark-mode').textContent).toBe('true'));
    fireEvent.click(getByTestId('toggle-dark-mode'));
    await waitFor(() => expect(getByTestId('dark-mode').textContent).toBe('false'));
  });
});
