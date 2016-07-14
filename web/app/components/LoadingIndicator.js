import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';

const LoadingIndicator = () => (
  <div style={{ marginTop: 24, textAlign: 'center' }}>
    <CircularProgress size={2} />
  </div>
);

export default LoadingIndicator;
