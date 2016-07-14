import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
import theme from '../theme';

const App = ({ children }) => (
  <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
    {children}
  </MuiThemeProvider>
);

App.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default App;
