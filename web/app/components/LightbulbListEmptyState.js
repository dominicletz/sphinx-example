import RaisedButton from 'material-ui/RaisedButton';
import  React from 'react';

const LightbulbListEmptyState = ({ onAddLightbulb }) => (
  <div style={{ textAlign: 'center', marginTop: 24 }}>
    <h3>You don't have any lightbulbs</h3>
    <RaisedButton
      label="+ Add one"
      onTouchTap={onAddLightbulb}
      primary
      style={{ marginTop: 16 }}
    />
  </div>
);

LightbulbListEmptyState.propTypes = {
  onAddLightbulb: React.PropTypes.func.isRequired,
};

export default LightbulbListEmptyState;
