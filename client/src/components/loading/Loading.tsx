import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type SpinnerProps = {
  width: string;
  height: string;
};

/**
 * Spinner
 *
 * Component to show a spinner while loading data.
 */
export const Spinner = ({ width, height }: SpinnerProps) => {
  return (
    <Box sx={{ display: 'flex', width: width, height: height, justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
};
