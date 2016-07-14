import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './views/App';
import Authenticated from './views/Authenticated';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import SignupConfirmationView from './views/SignupConfirmationView';
import SignupView from './views/SignupView';
import LightbulbView from './views/LightbulbView';
import LightbulbListView from './views/LightbulbListView';

require('./sass/styles.scss');

injectTapEventPlugin();

render(
  <Router history={hashHistory}>
    <Route path="" component={App}>
      <IndexRedirect to="/login" />
      <Route path='/login' component={LoginView} />
      <Route path='/logout' component={LogoutView} />
      <Route path='/signup' component={SignupView} />
      <Route path='/signup-confirmation' component={SignupConfirmationView} />

      <Route path="/" component={Authenticated}>
        <IndexRedirect to="/lightbulbs" />
        <Route path="lightbulbs/:serialnumber" component={LightbulbView} />
        <Route path="lightbulbs" component={LightbulbListView} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);
