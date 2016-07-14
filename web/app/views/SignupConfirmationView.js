import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { Link } from 'react-router';

const SignupConfirmationView = () => (
  <div className="auth-page">
    <div className="container" style={{ marginTop: 48, textAlign: 'center' }}>
      <h1>Verify your email.</h1>
      <p>
        You've just been sent an email that contains a confirmation link.
        <br />
        In order to activate your account, please click the verification link
        in the email we just sent you.
      </p>
      <FlatButton
        containerElement={<Link to="login" />}
        label="click here to login"
        secondary
      />
    </div>
  </div>
);

export default SignupConfirmationView;
