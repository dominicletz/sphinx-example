import React from 'react';
import { browserHistory } from 'react-router';

import Form from 'muicss/lib/react/form'
import Button from 'muicss/lib/react/button'
import Input from 'muicss/lib/react/input'

import TextField from 'material-ui/lib/text-field';
import Spinner from '../components/spinner';
import { attemptSignup } from '../actions/auth'
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Container from 'muicss/lib/react/container';

export default React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  handleSignup(event) {
    event.preventDefault();
    event.preventDefault()
    const email = event.target.elements[0].value
    const password = event.target.elements[1].value

    attemptSignup(email, password)(this.context.store.dispatch)
  },

  componentWillMount () {
    this.unsubscribe = this.context.store.subscribe(() => {
      let state = this.context.store.getState()

      if (state.auth.session != null && state.auth.session.loginhack === true) {
        browserHistory.push('/login')
        return
      }

      // FIXME: This is definitely the wrong way to do this, use react-redux's `connect`
      this.forceUpdate()
    })
  },

  componentWillUnmount () {
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
        <AppBar style={ appBarStyle } showMenuIconButton={false} iconElementRight={ <RaisedButton linkButton={true} href="/login" label="LOGIN" primary={true} /> } />

        <Container>
          <div className='logo-container'>
            <img src="images/example_iot_company_logo.svg" />
          </div>
          <h2 className="page-header">Sign Up</h2>
          {error_message}

          <Form onSubmit={this.handleSignup}>
            <Input label='Email address' floatingLabel/>
            <Input type='password' label='Password' floatingLabel/>
            <Button className='signup-button' color='primary'>SEND VERIFICATION EMAIL</Button>
            {spinner_when_waiting}
          </Form>

          <div className="terms-conditions">
            <p>By creating an account, you agree to the Terms and Conditions</p>
          </div>

          <footer className="version">
            Version 1.0.3
          </footer>
        </Container>
      </div>
    )
  }
})
