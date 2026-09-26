import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link, useNavigate } from 'react-router';

import MovieIcon from '../../assets/SVG/camera-white.svg';
import LoginButton from './LoginButton';
import styles from './Navbar.module.scss';

/**
 *
 * Navbar component.
 *
 * @returns {React.JSX.Element}
 *
 */

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      void navigate('/');
    }
  };
  return (
    <AppBar position='static'>
      <Toolbar className={styles.navbarToolbar}>
        <IconButton
          component={Link}
          to='/'
          edge='start'
          color='inherit'
          aria-label='Bingewatcher home'
          data-testid='home-link'
          onClick={handleLogoClick}
        >
          <img src={MovieIcon} width='40' alt='Bingewatcher icon' data-testid='HomeIcon' />
          <p className={styles.navbarTitle}>Bingewatcher</p>
        </IconButton>
        <LoginButton />
      </Toolbar>
    </AppBar>
  );
};
