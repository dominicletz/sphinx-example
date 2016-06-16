import React from 'react'
import { browserHistory } from 'react-router'
import Button from 'muicss/lib/react/button'
import { logout } from '../actions/auth'

export default React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  handleLogout (event) {
    event.preventDefault()

    logout()(this.context.store.dispatch)
  },

  componentWillMount () {
    this.unsubscribe = this.context.store.subscribe(() => {
      let state = this.context.store.getState()

      // FIXME: This is probably the wrong way to do this.
      if (state.auth.session === undefined) {
        browserHistory.push('/login')
      }

      this.forceUpdate()
    })
  },

  componentWillUnmount() {
    if (typeof this.unsubscribe == "function") { this.unsubscribe() }
  },

  render () {
    return (
      <div>
        <h2>Logout</h2>
        <Button color='secondary' onClick={this.handleLogout}>Logout</Button>
      </div>
    )
  }
})
