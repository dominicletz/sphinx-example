/*\
|*| This is a presentational component responsible for displaying the
|*| form to add a lightbulb. There is no logic / state, it's all presentational.
|*| We happen to use this in a modal but this component doesn't care, it should
|*| work wherever it's used.
|*|
|*| This is a presentational (or "dumb") compnent. It's only responsible for
|*| rendering DOM nodes or other components. Presentation components should not
|*| include any logic.
\*/

// by convention, the imports are split into two groups, 3rd party libs and src
// modules. The imports in those groups are then ordered alphabetically by their
// source name (the string value on the right of "from").
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React from 'react';
import MessageBox from './MessageBox';

// This component is in the React stateless function syntax.
// Basically it's just the render method you see in the React class syntax
// where the function argument are the component props.
const AddLightbulbForm = ({
  isAdding,
  formErrorText,
  nameProps,
  onAddLightbulb,
  onCancel,
  serialNumberProps,
}) => (
  <form onSubmit={onAddLightbulb}>
    {formErrorText && <MessageBox error text={formErrorText} />}
    <TextField
      autoFocus
      disabled={isAdding}
      floatingLabelFixed
      floatingLabelText="Name"
      hintText="E.g. Living Room Lamp"
      {...nameProps}
    />
    <TextField
      disabled={isAdding}
      floatingLabelFixed
      floatingLabelText="Identity / Serial Number"
      hintText="E.g. abcde12345"
      {...serialNumberProps}
    />
    <div className="dialog__actions">
      <FlatButton disabled={isAdding} label="Cancel" onTouchTap={onCancel} primary />
      <RaisedButton disabled={isAdding} label="Add" onTouchTap={onAddLightbulb} primary>
        {isAdding && <LinearProgress />}
      </RaisedButton>
    </div>
</form>
);

AddLightbulbForm.propTypes = {
  isAdding: React.PropTypes.bool,
  formErrorText: React.PropTypes.string,
  nameProps: React.PropTypes.object.isRequired,
  serialNumberProps: React.PropTypes.object.isRequired,
  onAddLightbulb: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
};

export default AddLightbulbForm;
