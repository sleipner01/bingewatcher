import { createContext, useContext } from 'react';

import { User } from '../types';

interface UserContextProps {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  login: () => void;
  logout: () => void;
  deleteUser: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const UserContext = createContext<UserContextProps | null>(null);

/**
 * Custom hook to manage user state.
 *
 * @returns {Object} user, setUser, login, logout, deleteUser, addMovieToWatchlist
 * @example
 * const { login, logout, deleteUser } = useUser();
 *
 * <button onClick={login}>Login</button>
 * <button onClick={logout}>Logout</button>
 * <button onClick={deleteUser}>Delete user</button>
 */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) throw new Error('useUser must be used within a UserProvider');

  return context;
}
