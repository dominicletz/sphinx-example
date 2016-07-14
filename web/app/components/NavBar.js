import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { white } from 'material-ui/styles/colors';
import HomeIcon from 'material-ui/svg-icons/action/home';
import ChevronLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import React from 'react';
import { Link } from 'react-router';

const NavBar = ({ showHomeButton }) => (
  <AppBar
    showMenuIconButton={false}
    title={
      <div className="container container--nav-bar">
        {
          showHomeButton &&
          <RaisedButton
            containerElement={
              <Link to="/lightbulbs" />
            }
            icon={
              <div className="navbar__button-icon">
                <ChevronLeftIcon color={white} />
                <HomeIcon color={white} />
              </div>
            }
            secondary
            style={{ position: 'absolute', top: 14, left: 0 }}
          />
        }
        <img className="logo" src="/images/example_iot_company_logo_mark.svg" />
        <FlatButton
          containerElement={
            <Link to="/logout" />
          }
          label="Logout"
          secondary
          style={{ position: 'absolute', top: 14, right: 0 }}
        />
      </div>
    }
  />
);

export default NavBar;
