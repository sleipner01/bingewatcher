import Button from '@mui/material/Button';
import { Link } from 'react-router';

/**
 *
 * NotFound component.
 * Component to be displayed when the user tries to access a page that does not exist.
 *
 * @returns {React.JSX.Element}
 */

export const NotFound = () => (
  <div>
    <h1 style={{ color: 'var(--color-text)' }}>We are sorry, but this is not a valid route...</h1>
    <Link to='/'>
      <Button variant='contained' aria-label='go home'>
        Back to exploring!
      </Button>
    </Link>
  </div>
);
