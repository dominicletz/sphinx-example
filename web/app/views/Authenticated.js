import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import { hashHistory } from 'react-router';
import api from '../api';
import store from '../store';

/*
 *  The idea is that any route which requires authentication is a child to this
 *  component. Any component which does not require authentication is not a
 *  child to this component.
 *
 *  Before navigating to the route we check to see if the user is authenticated.
 *  If the user is not authenticated, we attempt to restore their session using
 *  a cookie they may have. If the restore is unsuccessful the user is
 *  redirected to the login page.
 *
 *  All of this logic is executed from the 'componentWillMount' react-lifecycle
 *  method. That means this component will have to be unmounted and mounted
 *  again before a subsequent auth-check is made. Basically, if the user is
 *  authenticated already (and stays within the routes which require auth),
 *  there won't be any other auth checks. However, if the user navigates to a
 *  route which doesn't require authentication (i.e. the login page we redirect
 *  them to), this component will do another auth-check the next time the user
 *  requests another authed route.
 */

export default class Authenticated extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { isAuthenticated: !!(store.email && store.token) };
  }

  componentWillMount() {
    if (!this.isAuthenticated()) {
      api.restoreSession()
        .then(response => {
          this.setState({ isAuthenticated: true });
          store.email = response.payload.email;
          store.token = response.payload.token;
        })
        .catch(() => hashHistory.replace('/login'));
    }
  }

  isAuthenticated() {
    return this.state.isAuthenticated;
  }

  renderLoadingIndicator() {
    return (
      <div style={{ position: 'fixed', top: '50%', left: '50%', marginTop: -50, marginLeft: -50 }}>
        <CircularProgress size={2} />
      </div>
    );
  }

  render() {
    if (!this.isAuthenticated()) return this.renderLoadingIndicator();
    return this.props.children;
  }
}

Authenticated.propTypes = {
  children: React.PropTypes.node.isRequired,
};
