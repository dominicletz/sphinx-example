/*\
|*| This is a purly presentational component responsible for rendering an
|*| individual lightbulb list item. Although it's almost entirely material-ui
|*| components, it makes subtle appearance changes based on the properties
|*| it brings in. That's why it was split off into it's own component.
|*|
|*| This is a presentational (or "dumb") compnent. It's only responsible for
|*| rendering DOM nodes or other components. Presentation components should not
|*| include any logic.
\*/

// by convention, the imports are split into two groups, 3rd party libs and src
// modules. The imports in those groups are then ordered alphabetically by their
// source name (the string value on the right of "from").
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import { black, grey200, white, yellow500 } from 'material-ui/styles/colors';
import LightbulbIcon from 'material-ui/svg-icons/action/lightbulb-outline';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import React from 'react';
import { Link } from 'react-router';

const LightbulbListItem = ({
  isOn,
  name,
  serialNumber,
}) => (
  <ListItem
    containerElement={<Link to={`/lightbulbs/${serialNumber}`} />}
    leftAvatar={
      <Avatar
        backgroundColor={isOn ? yellow500 : grey200}
        icon={<LightbulbIcon style={{ fill: isOn ? white : black }} />}
      />
    }
    primaryText={name || '[unnamed]'}
    secondaryText={serialNumber}
    rightIcon={<MoreVertIcon />}
  />
);

LightbulbListItem.propTypes = {
  isOn: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string,
  serialNumber: React.PropTypes.string.isRequired,
};

export default LightbulbListItem;
