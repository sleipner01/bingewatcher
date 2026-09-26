import { faker } from '@faker-js/faker';
import { ReactNode, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { User } from '../types';
import { getItem, itemExists, removeItem, setItem } from '../utils/persistency';
import { UserContext } from './useUser';

/**
 * Provider to manage user state.
 * The user is stored in localStorage.
 * If the user is not logged in, the user is undefined.
 *
 * @param children
 * @returns {JSX.Element}
 */
export function UserProvider({ children }: { children: ReactNode }) {
  // Inital user state is set to the user stored in localStorage.
  // If no user exists in localStorage, the user is undefined.
  // If the user loginState is false, the user is undefined.
  let initialUser = getItem('user') as User | undefined;
  initialUser = initialUser && initialUser.loginState ? initialUser : undefined;
  const [user, setUser] = useState<User | undefined>(initialUser);

  const generateUser = () => {
    return { name: faker.person.fullName(), id: uuid(), loginState: true } as User;
  };
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedDarkMode = getItem('darkMode');
    return storedDarkMode ? storedDarkMode : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      setItem('darkMode', newDarkMode);
      return newDarkMode;
    });
  };

  const login = () => {
    // Genereta a new user if no user exists in localStorage.
    if (!itemExists('user')) setItem('user', generateUser());

    // If there exists a user, set the loginState to true to allow refreshing the page.
    const tempUser = { ...(getItem('user') as User), loginState: true };
    setUser(tempUser);
    setItem('user', tempUser);
  };

  const logout = () => {
    setUser(undefined);
    setItem('user', { ...user, loginState: false });
  };

  const deleteUser = () => {
    setUser(undefined);
    setDarkMode(false);
    removeItem('user');
    removeItem('darkMode');
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    deleteUser,
    darkMode,
    toggleDarkMode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
