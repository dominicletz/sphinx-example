import React from 'react'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import Form from 'muicss/lib/react/form'
import Button from 'muicss/lib/react/button'
import Input from 'muicss/lib/react/input'
import Spinner from '../components/spinner'
import ShareLightbulbForm from '../components/share_lightbulb_form'
import { toggleLightbulbState, attemptShare, attemptDeleteLightbulb } from '../actions/lightbulbs'
import { logout } from '../actions/auth'

import FlatButton from 'material-ui/lib/flat-button';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Popover from 'material-ui/lib/popover/popover';
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import LightbulbIcon from 'material-ui/lib/svg-icons/action/lightbulb-outline.js';
import ActionAssignment from 'material-ui/lib/svg-icons/action/assignment';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionHome from 'material-ui/lib/svg-icons/action/home';
import ChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import Share from 'material-ui/lib/svg-icons/social/share';
import NotificationsActive from 'material-ui/lib/svg-icons/social/notifications-active';
import Delete from 'material-ui/lib/svg-icons/action/delete';
import Colors from 'material-ui/lib/styles/colors';

export default React.createClass({
  contextTypes: {
    store: React.PropTypes.object
  },

  componentWillMount() {
    let state = this.context.store.getState();

    this.unsubscribe = this.context.store.subscribe(() => {
      if (state.lightbulbs.statuses.filter(v => v.serialnumber == this.props.params.sn).length == 0) {
        browserHistory.push('/lightbulbs')
      }

      // FIXME: This is probably the wrong way to do this.
      if (state.auth.session === undefined) {
        browserHistory.push('/login')
      }
      // FIXME: This is definitely the wrong way to do this, use react-redux's `connect`

    })
    this.forceUpdate()
  },

  componentWillUnmount () {
    if (typeof this.unsubscribe == "function") { this.unsubscribe() }
  },

  handleShare (r) {
    attemptShare(r.email, this.props.params.sn)(this.context.store.dispatch)
  },

  handleDelete (r) {
    attemptDeleteLightbulb(this.props.params.sn)(this.context.store.dispatch,this.context.store.getState)
  },

  /**
   * TODO: this can't the right way to handle logging out...
   */
  handleLogout (event) {
    event.preventDefault();

    logout()(this.context.store.dispatch);

    browserHistory.push('/login');

    this.forceUpdate();
  },

  render() {
    let spinner_when_waiting = (
      this.context.store.getState().lightbulbs.isFetching
      ? <Spinner />
      : <Spinner style={{visibility: "hidden"}} />
    );

    let error_message = (
      this.context.store.getState().auth.error == null
      ? <div></div>
      : <div className='messagebox error'>{this.context.store.getState().auth.error}</div>
    );

    let appBarStyle = {
      backgroundColor: '#ffffff'
    };

    const logoutButton = (
      <FlatButton label="LOGOUT"
                  primary={true}
                  style={{ color: 'rgb(255, 64, 129)' }}
                  onTouchStart={this.handleLogout}
                  onMouseUp={this.handleLogout} />
    );

    let state = this.context.store.getState();

    let lightbulb = state.lightbulbs.statuses.find(lb => lb.serialnumber === this.props.params.sn);

    let iconStyle = {
      top: 16
    };

    let shares = state.lightbulbs.shares.filter(v => v.serialnumber == this.props.params.sn);
    let sharesList = (
      (shares.length > 0) ?
        shares.map((v) => {
          return (
            <ListItem leftAvatar={ <Share style={iconStyle} /> }
                      primaryText={ v.email }
                      rightIconButton={<IconButton><Delete style={iconStyle} /></IconButton>} /> )
        }) :
        ( <ListItem primaryText="Not yet shared." /> )
    );

    let alerts = state.lightbulbs.alerts.filter(v => v.serialnumber == this.props.params.sn);
    console.log("alerts: ", alerts[0]);
    let alertsList = (
      (alerts.length > 0) ?
        alerts.map((v) => {
          return (
            <ListItem leftAvatar={ <NotificationsActive style={iconStyle} /> }
                      primaryText={ v.name }
                      rightIconButton={<IconButton><Delete style={iconStyle} /></IconButton>} /> )
        }) :
        ( <ListItem primaryText="No alerts created." /> )
    );

    const rightIconMenu = (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon color={Colors.grey400} /></IconButton>}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}} >
        <MenuItem primaryText="Turn on" />
        <MenuItem primaryText="Add Alert" />
        <MenuItem primaryText="Share" />
        <MenuItem primaryText="Edit" />
        <MenuItem primaryText="Delete" />
      </IconMenu>
    );

    return (
      <div>
        <AppBar title={ <div className='appbar-logo-container'><img src='/images/example_iot_company_logo_mark.svg' /></div> }
                style={ appBarStyle }
                iconElementRight={ logoutButton }
                showMenuIconButton={false} />

        <div className="nav-bar">
          <RaisedButton linkButton={true}
                        href="/lightbulbs"
                        style={{ maxWidth: 45 }}
                        primary={true}
                        icon={ (<span className="home-icon"><ChevronLeft color={ '#ffffff' } /><ActionHome color={ '#ffffff' } /></span>)}/>
        </div>

        <List>
          <ListItem leftAvatar={<Avatar icon={<LightbulbIcon />} backgroundColor={ lightbulb.state === 'on' ? Colors.yellow600 : Colors.grey300} />}
                    primaryText={lightbulb.name}
                    secondaryText={lightbulb.serialnumber}
                    rightIconButton={rightIconMenu} />
        </List>

        <List subheader="Shared with" insetSubheader={false}>
          { sharesList }
        </List>

        <List subheader="Alerts" insetSubheader={false}>
          { alertsList }
        </List>

      </div>
    )
  }
})
