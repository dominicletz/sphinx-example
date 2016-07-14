import React from 'react';
import { hashHistory } from 'react-router';
import api from '../api';
import Login from '../components/Login';
import store from '../store';

export default class LoginView extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      errorText: null,
      isAuthenticating: false,
    };
  }

  handleSubmit(evt) {
    evt.preventDefault(evt);
    const password = evt.target.elements.password.value;
    const email = evt.target.elements.email.value;
    this.setState({ errorText: null, isAuthenticating: true });
    api.login(email, password)
      .then(response => {
        store.email = email;
        store.token = response.payload.token;
        hashHistory.replace('/lightbulbs');
      })
      .catch(err => {
        this.setState({
          errorText: err.response.status === 400 ? 'Invalid username or password' : err.toString(),
          isAuthenticating: false,
        });
      });
  }

  render() {
    const { errorText, isAuthenticating } = this.state;
    return (
      <Login
        errorText={errorText}
        isAuthenticating={isAuthenticating}
        onSubmit={(evt) => this.handleSubmit(evt)}
      />
    );
  }
}
