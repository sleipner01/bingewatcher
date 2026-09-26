import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, MenuItem } from '@mui/material';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { Link } from 'react-router';

import { useUser } from '../../context/UserContext';
import DarkModeToggle from '../darkModeToggle/DarkModeToggle';
import styles from './LoginButton.module.scss';

/**
 * Login button component.
 * If the user is logged in, the user's name is displayed.
 * If the user is not logged in, the login button is displayed.
 * If the user is logged in, a menu is displayed with the following options:
 * - My Watchlist
 * - Logout
 * - Delete user
 *
 * @returns {React.JSX.Element}
 */

const LoginButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, login, logout, deleteUser } = useUser();

  const handleLogin = () => {
    login();
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    deleteUser();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        return;
      } else {
        handleMenuClose();
      }
    }
  };

  return user ? (
    <>
      <IconButton color='inherit' onClick={handleMenuOpen} data-testid='menu'>
        <p className={styles.loginText} data-testid='user-name'>
          {user.name}
        </p>
        <MenuIcon fontSize='large' aria-label='menu' titleAccess='menu' sx={{ margin: '0 0 0 10px' }} />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem>
          <Box sx={{ padding: '0 10px' }}>
            <DarkModeToggle />
          </Box>
        </MenuItem>
        <Link to='/watchlist' className={styles.navLink} data-testid='watchlist-link' onClick={handleMenuClose}>
          <MenuItem>My Watchlist</MenuItem>
        </Link>
        <button className={styles.button} onClick={handleLogout} data-testid='logout'>
          <MenuItem>Logout</MenuItem>
        </button>
        <button
          className={styles.button}
          onKeyDown={handleKeyDown}
          onClick={handleDeleteUser}
          data-testid='delete-user'
        >
          <MenuItem>Delete user</MenuItem>
        </button>
      </Popover>
    </>
  ) : (
    <IconButton color='inherit' onClick={handleLogin} data-testid='login-button'>
      <p className={styles.loginText}>Login</p>
      <AccountCircleIcon fontSize='large' sx={{ margin: '0 0 0 6px' }} />
    </IconButton>
  );
};

export default LoginButton;
