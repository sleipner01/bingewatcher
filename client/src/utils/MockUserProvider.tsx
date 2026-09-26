import { FC, ReactNode, useState } from 'react';
import { vi } from 'vitest';

// Importer UserContext
import { UserContext } from '../context/useUser';
import { User } from '../types';

interface MockUserProviderProps {
  children: ReactNode;
  mockUser?: User;
  loginMock?: () => void;
  logoutMock?: () => void;
  deleteUserMock?: () => void;
  toggleDarkModeMock?: () => void;
}

const MockUserProvider: FC<MockUserProviderProps> = ({
  children,
  mockUser,
  loginMock = vi.fn(),
  logoutMock = vi.fn(),
  deleteUserMock = vi.fn(),
  toggleDarkModeMock = vi.fn(),
}) => {
  const [user, setUser] = useState<User | undefined>(mockUser);

  const login = loginMock;
  const logout = logoutMock;
  const deleteUser = deleteUserMock;
  const toggleDarkMode = toggleDarkModeMock;

  const value = {
    user,
    setUser,
    login,
    logout,
    deleteUser,
    darkMode: false,
    toggleDarkMode,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default MockUserProvider;
