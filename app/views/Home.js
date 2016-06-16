import React from 'react'
import { browserHistory } from 'react-router'
import Button from 'muicss/lib/react/button'
import RaisedButton from 'material-ui/lib/raised-button';
import ExositeTheme from './ExositeTheme'

export default React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  isLoggedIn () {
    return this.context.store.getState().auth.session !== undefined
  },

  render () {
    const style = {
      margin: 10,
    };

    if (this.isLoggedIn()) {
      return (
        <div>
          <h2>My Home</h2>
          <RaisedButton
            style={style}
            secondary={true}
            backgroundColor={ExositeTheme.palette.primary2Color}
            label='My Lightbulbs'
            linkButton={true}
            href={'/lightbulbs'} />

          <RaisedButton
            style={style}
            secondary={true}
            backgroundColor={ExositeTheme.palette.primary2Color}
            label='My Account'
            linkButton={true}
            href={'/account'} />

        </div>
      )
    } else {
      return (
        <div>
          <h1>Brilliant Beacon</h1>
          <h4>Smart home lighting solution</h4>

          <RaisedButton
            style={style}
            secondary={true}
            backgroundColor={ExositeTheme.palette.primary2Color}
            label='Log In'
            linkButton={true}
            href={'/login'} />

          <RaisedButton
            style={style}
            secondary={true}
            backgroundColor={ExositeTheme.palette.primary2Color}
            label='Create Account'
            linkButton={true}
            href={'/signup'} />

        </div>
      )
    }
  }
})
