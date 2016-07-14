/*\
|*| This component is responsible for:
|*|   - Managing an individual lightbulb's state
|*|   - Passing those state props to presentational components
|*|       - lightbulb name, serial number, on/off, error state, etc.
|*|   - Handling events from those components
|*|       - edit, delete, turn on/off, share, add alert
|*|
|*| Since it's bad practice to include presentation in a "smart component"
|*| (a component which handles logic), there is no DOM markup. This component
|*| only renders other react components, passing state info to them and handling
|*| their events.
|*|
|*| This component could have rendered a bunch of material-ui components and
|*| it'd still keep the separation between "smart" and "dumb/presentational"
|*| components up to a certain point. When you factor in color changes and that
|*| type of stuff it makes sense to split out rendering to a new component.
|*|
|*| Note: Since this is an example app intended to help web developers get
|*| started using Murano, we've tried to make it as simple to follow as
|*| possible. We recognize not all web-developers know React so we wrote things
|*| in a way that we feel is easiest to understand coming from other backgrounds
|*| such as Angular, backbone, etc. In order to do that we avoided certain
|*| things that React developers might not like. For example, we're not using a
|*| React state manager such as Flux or Redux. This adds more burden, makes
|*| things not as scalable, gets rid of helpful features like auto-updating
|*| of many compnoents, etc.  However, it avoids extra learning and removes some
|*| crazy magic that is not obvious.
\*/

import React from 'react';
import LightbulbListItem from './LightbulbListItem';

export default class LightbulbListItemContainer extends React.Component {
  render() {
    const { name, serialnumber, state } = this.props.lightbulb;
    return (
      <LightbulbListItem
        isOn={parseInt(state) === 1}
        name={name}
        serialNumber={serialnumber}
      />
    );
  }
}

LightbulbListItemContainer.propTypes = {
  lightbulb: React.PropTypes.object.isRequired,
};
