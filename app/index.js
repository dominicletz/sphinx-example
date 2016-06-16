import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import App from './views/App'
import Home from './views/Home'
import Login from './views/Login'
import Logout from './views/Logout'
import Signup from './views/Signup'
import Account from './views/Account'
import Lightbulbs from './views/Lightbulbs'
import Lightbulb from './views/Lightbulb'

require('./sass/styles.scss');

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Login} />
      <Route path='/login' component={Login} />
      <Route path='/logout' component={Logout} />
      <Route path='/signup' component={Signup} />
      <Route path='/account' component={Account} />
      <Route path='/lightbulbs' component={Lightbulbs} />
      <Route path='/lightbulbs/:sn' component={Lightbulb} />
    </Route>
  </Router>
), document.getElementById('app'))
