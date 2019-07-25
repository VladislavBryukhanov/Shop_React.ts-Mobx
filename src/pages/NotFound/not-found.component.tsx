import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const NotFoundPage: React.FC = () => {
  return (
    <Grid container
          justify="center"
          className="Page"
          alignItems="center"
    >
      <Typography variant="h2" component="h2" gutterBottom>404 Page Not Found</Typography>
    </Grid>
  )
};