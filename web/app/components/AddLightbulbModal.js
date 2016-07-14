/*\
|*| This component is responsible for:
|*|   - Passing state info / handling events from the add lightbulb form
|*|   - Validating form input fields
|*|   - Knowing when a product can be added
|*|   - Adding the product / handling any errors
|*|   - Disabling the form when a device is being added
|*|
|*| Since it's bad practice to include presentation in a "smart component"
|*| (a component which handles logic), there is no DOM markup. This component
|*| only renders other react components, passing state info to them and handling
|*| their events.
|*|
|*| Note: Since this is an example app intended to help web developers get
|*| get started using Murano, we've tried to make it as simple to follow as
|*| possible. We recognize not all web-developers know React so we wrote things
|*| in a way that we feel is easiest to understand coming from other backgrounds
|*| such as Angular, backbone, etc. In order to do that we avoided certain
|*| things that React developers might not like. For example, we're not using a
|*| React state manager such as Flux or Redux. This adds more burden, makes
|*| things not as scalable, gets rid of helpful features like auto-updating
|*| of many compnoents, etc.  However, it avoids extra learning and removes some
|*| crazy magic that is not obvious.
\*/

// by convention, the imports are split into two groups, 3rd party libs and src
// modules. The imports in those groups are then ordered alphabetically by their
// source name (the string value on the right of "from").
import Dialog from 'material-ui/Dialog';
import React from 'react';
import api from '../api';
import AddLightbulbForm from './AddLightbulbForm';

/* helper method so we can always reset the state of this component */
function getInitialState(context) {
  return {
    formErrorText: null,
    isAdding: false,
    // this is a name field meant to be applied to the name input
    // it handles all useful events & the name value
    name: {
      errorText: null,
      onBlur() { context.validateName() },
      onChange(evt, value) {
        const name = {
          ...context.state.name,
          value,
        };
        context.setState({ name });
        context.validateName(name);
      },
      value: '',
    },
    // this is a serialNumber field meant to be applied to the name input
    // it handles all useful events & the name value
    serialNumber: {
      errorText: null,
      onBlur() { context.validateSerialNumber() },
      onChange(evt, value) {
        const serialNumber = {
          ...context.state.serialNumber, // keep all other serial number props the same
          value,
        };
        context.setState({ serialNumber });
        context.validateSerialNumber(serialNumber);
      },
      value: '',
    },
  };
}

export default class AddLightbulbModal extends React.Component {
  /**
   * constructor() is where you initialize the react state. By convention it is
   * the first method defined in any JavaScript class.
   */
  constructor(...args) {
    super(...args);
    this.state = getInitialState(this);
  }

  /* add / remove error text & return if name is valid */
  validateName(nextNameState) {
    // We have to allow the ability to pass in the state because this.setState()
    // doesn't update immediately. This is one example where a React state
    // manager would be useful
    const name = nextNameState || this.state.name;

    let errorText = null;
    if (!name.value) errorText = 'This field is required';

    if (name.errorText !== errorText) {
      this.setState({
        name: {
          ...name, // keep all other name properties the same
          errorText,
        },
      });
    }

    return !errorText; // field is valid if there's no error text
  }

  /* add / remove error text & return if the serial number is valid */
  validateSerialNumber(nextSerialNumberState) {
    // We have to allow the ability to pass in the state because this.setState()
    // doesn't update immediately. This is one example where a React state
    // manager would be useful
    const serialNumber = nextSerialNumberState || this.state.serialNumber;
    let errorText = null;
    if (!serialNumber.value) errorText = 'This field is required';

    if (serialNumber.errorText !== errorText) {
      this.setState({
        serialNumber: {
          ...serialNumber, // keep all other serial number properties the same
          errorText,
        },
      });
    }

    return !errorText; // field is valid if there's no error text
  }

  /* add / remove all error text & return if the entire form is valid */
  validateForm() {
    const validName = this.validateName();
    const validSerialNumber = this.validateSerialNumber();

    return validName && validSerialNumber;
  }

  /**
   * If the form is valid, make the api call to add a lightbulb. Handle /
   * display an error if one occurs. Otherwise close the modal. We won't worry
   * about updating the list of lightbulbs since it's polling frequently.
   */
  handleAddLightbulb() {
    const isFormValid = this.validateForm();
    if (!isFormValid) return;

    this.setState({ isAdding: true });
    const { name, serialNumber } = this.state;
    api.addLightbulb(name.value, serialNumber.value)
      .then(() => this.handleCloseModal())
      .catch(err =>
        this.setState({
          // normally you'll want to display a more friendly error to the user
          formErrorText: err.toString(),
          isAdding: false,
        })
      );
  }

  /* Close the modal and reset the state for the next time it's open */
  handleCloseModal() {
    this.props.onRequestClose();
    this.setState(getInitialState(this));
  }

  /**
   * render() is a react lifecycle method which is called anytime the component
   * is updated (i.e. when the props or state change). By convention it is the
   * last method defined in the React component.
   */
  render() {
    const { isOpen, onRequestClose } = this.props;
    const { isAdding, formErrorText, name, serialNumber } = this.state;
    // Note: the <Dialog /> component has an "actions" property. Normally you'd
    // use this to render the actions. However, you can't get those actions into
    // a form so it's hard to get "enter" to submit the form. We just render
    // them inside the form & style them appropriately.
    return (
      <Dialog
        contentStyle={{ width: 304 }}
        modal
        open={isOpen}
        title="New Device"
      >
        <AddLightbulbForm
          isAdding={isAdding}
          formErrorText={formErrorText}
          nameProps={name}
          serialNumberProps={serialNumber}
          onCancel={() => this.handleCloseModal()}
          onAddLightbulb={() => this.handleAddLightbulb()}
        />
      </Dialog>
    );
  }
}

AddLightbulbModal.propTypes = {
  onRequestClose: React.PropTypes.func.isRequired, // when you want to close it
};
