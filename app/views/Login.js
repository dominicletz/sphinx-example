import React from 'react';
import { browserHistory } from 'react-router';
import Link from 'react-router';

import Form from 'muicss/lib/react/form'
import Button from 'muicss/lib/react/button'
import Input from 'muicss/lib/react/input'

import TextField from 'material-ui/lib/text-field';
import Spinner from '../components/spinner';
import { attemptLogin } from '../actions/auth'
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Container from 'muicss/lib/react/container';

export default React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  handleLogin(event) {
    event.preventDefault();
    const email = event.target.elements[0].value;
    const password = event.target.elements[1].value;

    // HACK
    window.sessionStorage.setItem('email', email);

    attemptLogin(email, password)(this.context.store.dispatch);
  },

  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => {
      let state = this.context.store.getState()

      // FIXME: This is probably the wrong way to do this.
      if (state.auth.session !== undefined) {
        browserHistory.push('/lightbulbs')
        return
      }

      this.forceUpdate()
    })
  },

  componentWillUnmount() {
    if (typeof this.unsubscribe == "function") { this.unsubscribe() }
  },

  render () {
    let spinner_when_waiting = (
      this.context.store.getState().auth.status === 'waiting'
      ? <Spinner />
      : <Spinner style={{visibility: "hidden"}} />
    );

    let error_message = (
      this.context.store.getState().auth.error == null
      ? <div></div>
      : <div className='messagebox error'>{this.context.store.getState().auth.error}</div>
    );

    let appBarStyle = {
      backgroundColor: '#ffffff',
      boxShadow: 'none'
    };

    return (
      <div>
        <AppBar style={ appBarStyle } showMenuIconButton={false} iconElementRight={ <RaisedButton linkButton={true} href="/signup" label="SIGNUP" primary={true} /> } />

        <Container>
          <div className='logo-container'>
            <img src="images/example_iot_company_logo.svg" />
          </div>
          <h2 className="page-header">Login</h2>
          {error_message}

          <Form onSubmit={this.handleLogin}>
            <Input label='Email address' floatingLabel/>
            <Input type='password' label='Password' floatingLabel/>
            <Button className='login-button' color='primary'>Login </Button>
            {spinner_when_waiting}
          </Form>

          <FlatButton label="FORGOT PASSWORD?" secondary={true} className='forgot-password-button'/>

          <footer className="version">
            Version 1.0.3
          </footer>
        </Container>
      </div>
    )
  }
})
