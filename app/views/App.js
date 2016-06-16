import React from 'react'
import { Provider } from 'react-redux'
import AppStore from '../stores/app'
import Container from 'muicss/lib/react/container'

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


export default React.createClass({

  render () {
   return (
      <Provider store={AppStore}>
        <div>
          {this.props.children}
        </div>
      </Provider>
    )
  }
})
