/*\
|*| This page is responsible for:
|*|   - Loading a list of lightbulbs & polling them
|*|   - redirecting to the lightbulb list if the requested bulb doesn't exist
|*|   - Updating the bulb state on every change seen
|*|   - Passing state to other components / handing their events
|*|       - state: All info about the bulb
|*|       - events: Turning on/off the bulb
|*|
|*| Since it's bad practice to include presentation in a "smart component"
|*| (a component which handles logic), there is no DOM markup. This component
|*| only renders other react components, passing state info to them and handling
|*| their events.
|*|
|*| Note 2: Since this is an example app intended to help web developers get
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

// by convention, the imports are split into two groups, 3rd party libs and src
// modules. The imports in those groups are then ordered alphabetically by their
// source name (the string value on the right of "from").
import React from 'react';
import { hashHistory } from 'react-router';
import api from '../api';
import MessageBox from '../components/MessageBox';
import LightbulbDetail from '../components/LightbulbDetail';
import LoadingIndicator from '../components/LoadingIndicator';
import NavBar from '../components/NavBar';
import store from '../store';

// Special error for web developers to let them know something is wrong with
// their Murano configuration.
function getMuranoErrorText() {
  return `Murano Error: It appears this serial number was either not
    added as a device, this device was not activated, the product was
    not associated with this solution, or the device has not written
    to the platform.`;
}

export default class LightbulbView extends React.Component {
  /**
   * constructor() is where you initialize the react state. By convention it is
   * the first method defined in any JavaScript class.
   */
  constructor(props) {
    super(props);

    let lightbulb = null;
    let errorText = null;
    if (store.lightbulbs) {
      lightbulb = store.lightbulbs.filter(bulb => bulb.serialnumber == props.params.serialnumber)[0];
      if (lightbulb &&
          (lightbulb.state === null ||
           !lightbulb.hasOwnProperty('state') ||
           lightbulb.state === "undefined")) {
        lightbulb = null;
        errorText = getMuranoErrorText();
      }
    }

    this.state = {
      errorText,
      isChangingBulbState: false,
      lightbulb,
    };
  }

  /**
   * componentWillMount() is a react lifecycle method. When this is called
   * the render() method below has yet to be called. We'll use this to fetch
   * the list of lightbulbs & setup polling.
   * By convention the react lifecycle methods are defined at the top of the
   * the class, just after the constructor (except for the render method).
   */
  componentWillMount() {
    this.mounted = true;
    this.pollLightbulbs();
  }

  /**
   * componentWillUnmount() is a react lifecycle method. This is called right
   * before the react component is about to be taken off the screen. It won't
   * automagically stop our infinite polling loop so we need to stop it.
   */
  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.state.timeoutId);
  }

  /**
   * Get the list of lightbulbs, then wait one second and get the list again.
   * Update the state / store every successful response. Handle any unexpected
   * errors. (Note: some errors are caught and handled by the api service).
   */
  pollLightbulbs() {
    api.getLightbulbs()
      .then(response => this.handleLightbulbApiResponse(response))
      .catch(err => {
        clearTimeout(this.state.timeoutId);
        if (!this.mounted) return;
        this.setState({
          errorText: err.toString(),
          lightbulb: null,
          timeoutId: null,
        })
      });
  }

  /**
   * Handle the successful api.getLightbulbs response. Setup the polling to
   * re-fetch the lightbulbs. Update the state as necessary.
   * If for whatever reason, the lightbulb we're looking isn't in the list of
   * lightbulbs, then we shouldn't be on this page. If there wasn't any change
   * in the list of lightbulbs it isn't really necessary to update the state.
   */
  handleLightbulbApiResponse(response) {
    if (!this.mounted) return;
    const timeoutId = setTimeout(() => this.pollLightbulbs(), 1000);
    const { serialnumber } = this.props.params;
    const lightbulbs = response.payload;
    const lightbulb = lightbulbs.filter(bulb => bulb.serialnumber == serialnumber)[0];

    if (!lightbulb) return hashHistory.replace('/lightbulbs');

    if (!lightbulb.hasOwnProperty('state') || lightbulb.state === null || lightbulb.state === "undefined") {
      return this.setState({
        errorText: getMuranoErrorText(),
        timeoutId,
      });
    }
    if (response.status === 304) this.setState({ errorText: null, timeoutId });
    else this.setState({ errorText: null, lightbulb, timeoutId });
  }

  handleSetLightbulbState(serialNumber, state) {
    if (this.state.isChangingBulbState) return; // no need to send off another request
    this.setState({ isChangingBulbState: true });
    api.setLightbulbState(serialNumber, state)
      .then(() => this.setState({ isChangingBulbState: false }))
      .catch(err => this.setState({ errorText: err.toString() }));
  }

  /* called when we know there's an error message. It includes a little bit of
   * presentation but don't tell anybody */
  renderErrorMessage() {
    return (
      <div className="container container--space">
        <MessageBox error text={this.state.errorText} />
      </div>
    );
  }

  renderMainContent() {
    const { errorText, isChangingBulbState, lightbulb } = this.state;
    if (errorText) return this.renderErrorMessage();
    if (!lightbulb) return <LoadingIndicator />;

    const { humidity, name, serialnumber, temperature } = lightbulb;
    const state = parseInt(lightbulb.state);
    const toggledState = +!state; // toggle between 0 and 1 - JS magic!!

    return (
      <LightbulbDetail
        humidity={parseInt(humidity)}
        isChangingBulbState={isChangingBulbState}
        isOn={state === 1}
        name={name || '[unnamed]'}
        onSetLightbulbState={() =>
          this.handleSetLightbulbState(serialnumber, toggledState)
        }
        serialNumber={serialnumber}
        temperature={parseInt(temperature)}
      />
    );
  }

  render() {
    return (
      <div>
        <NavBar showHomeButton />
        {this.renderMainContent()}
      </div>
    );
  }
}
