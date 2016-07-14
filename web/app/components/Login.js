import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { white } from 'material-ui/styles/colors';
import React from 'react';
import { Link } from 'react-router';
import MessageBox from './MessageBox';

const Login = ({ errorText, isAuthenticating, onSubmit }) => (
  <div className="auth-page">
    <AppBar
      iconElementRight={
        <RaisedButton
          containerElement={<Link to="/signup" />}
          label="Sign up"
          secondary
        />
      }
      showMenuIconButton={false}
      style={{ background: white, boxShadow: 'none' }}
    />

    <main className="container container--small">
      <div className="logo-container">
        <img src="images/example_iot_company_logo_mark.svg" />
        <h1>Example</h1>
        <h4>IoT Company</h4>
      </div>

      <h2 style={{ textAlign: 'center' }}>Login</h2>
      {errorText && <MessageBox error text={errorText} />}

      <form onSubmit={onSubmit}>
        <TextField
          autoFocus
          hintText="Email address"
          floatingLabelText="Email address"
          fullWidth
          name="email"
          required
          type="email"
        />
        <TextField
          hintText="Password"
          floatingLabelText="Password"
          fullWidth
          name="password"
          required
          type="password"
        />
        <RaisedButton
          disabled={isAuthenticating}
          fullWidth
          label="Login"
          primary
          style={{ marginTop: 16, width: '100%' }}
          type="submit"
        >
          {isAuthenticating && <LinearProgress />}
        </RaisedButton>
      </form>

      <FlatButton label="Forgot password?" primary style={{ width: '100%' }} />
    </main>
    <footer className="version">
      Version 1.0.4
    </footer>
  </div>
);

Login.propTypes = {
  errorText: React.PropTypes.string,
  isAuthenticating: React.PropTypes.bool,
  onSubmit: React.PropTypes.func.isRequired,
};

export default Login;
