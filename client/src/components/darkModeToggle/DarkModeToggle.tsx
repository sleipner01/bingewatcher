import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Button from '@mui/material/Button';
import React from 'react';

import { useUser } from '../../context/useUser';
import styles from './Dark.module.scss';

/**
 * DarkModeToggle
 *
 * Button to toggle dark mode.
 * It is connected to the UserContext to get the current dark mode state and toggle it.
 *
 * @returns {React.FC}
 */
const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useUser();

  return (
    <>
      <Button
        variant='outlined'
        className={styles.toggle}
        aria-label='dark mode toggle'
        data-testid='dark-mode-toggle'
        onClick={toggleDarkMode}
        color='inherit'
      >
        {darkMode ? (
          <>
            Light mode
            <WbSunnyIcon />
          </>
        ) : (
          <>
            Dark mode
            <DarkModeIcon />
          </>
        )}
      </Button>
    </>
  );
};

export default DarkModeToggle;
