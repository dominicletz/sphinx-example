/*\
|*| This page is responsible for:
|*|   - Laying out other React components on the main lightbulbs list page
|*|     and passing any state info to them / handling their eveents
|*|   - Getting (and polling for) the list of lightbulbs & handling errors
|*|   - Knowing when to display the loading indicator, error message, or an
|*|     empty state
|*|   - opening / closing the add lightbulb modal
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
import api from '../api';
import MessageBox from '../components/MessageBox';
import FAB from '../components/FAB';
import LoadingIndicator from '../components/LoadingIndicator';
import AddLightbulbModal from '../components/AddLightbulbModal';
import LightbulbList from '../components/LightbulbList';
import LightbulbListEmptyState from '../components/LightbulbListEmptyState';
import NavBar from '../components/NavBar';
import PageHeader from '../components/PageHeader';
import store from '../store';

const HA_POLL_INTERVAL_MS = 1000;

export default class LightbulbListView extends React.Component {
  /**
   * constructor() is where you initialize the react state. By convention it is
   * the first method defined in any JavaScript class.
   */
  constructor(...args) {
    super(...args);

    this.state = {
      addingLightbulbErrorText: null,
      errorText: null,
      isAddingLightbulb: false,
      isAddLightbulbModalOpen: false,
      lightbulbs: store.lightbulbs || null,
      timeoutId: null,
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
   * Update the state and store every successful response. Handle any unexpected
   * errors. (Note: some errors are caught and handled by the api service).
   */
  pollLightbulbs() {
    api.getLightbulbs()
      .then(response => {
        if (!this.mounted) return;
        const timeoutId = setTimeout(() => this.pollLightbulbs(), HA_POLL_INTERVAL_MS);
        if (response.status === 304) {
          this.setState({ timeoutId });
        } else {
          store.lightbulbs = response.payload;
          this.setState({
            lightbulbs: response.payload,
            timeoutId,
          });
        }
      })
      .catch(err => {
        clearTimeout(this.state.timeoutId);
        if (!this.mounted) return;
        store.lightbulbs = null;
        this.setState({
          errorText: err.toString(),
          lightbulbs: null,
          timeoutId: null,
        });
      });
  }

  /**
   * Set the state so this component re-renders and the modal opens
   */
  openAddLightbulbModal() {
    this.setState({ isAddLightbulbModalOpen: true });
  }

  /**
   * Set the state so the component re-renders and the modal closes
   */
  closeAddLightbulbModal() {
    this.setState({ isAddLightbulbModalOpen: false });
  }

  /**
   * Render the main content that should be returned. This could be an error
   * message, the list of lightbulbs, loading indicator, or an empty state.
   */
  renderMainContent() {
    const { errorText, lightbulbs } = this.state;
    if (errorText) return <MessageBox error text={errorText} />;
    if (!lightbulbs) return <LoadingIndicator />;
    if (lightbulbs.length) return <LightbulbList lightbulbs={lightbulbs} />;
    return <LightbulbListEmptyState onAddLightbulb={() => this.openAddLightbulbModal()} />;
  }

  /**
   * render() is a react lifecycle method which is called anytime the component
   * is updated (i.e. when the props or state change). By convention it is the
   * last method defined in the React component.
   */
  render() {
    return (
      <div>
        <NavBar />
        <PageHeader title="My Home" />
        <div className="container">
          {this.renderMainContent()}
        </div>
        <AddLightbulbModal
          isOpen={this.state.isAddLightbulbModalOpen}
          isAdding={this.state.isAddingLightbulb}
          onAdd={(name, serialNumber) => this.addLightbulb(name, serialNumber)}
          onRequestClose={() => this.closeAddLightbulbModal()}
        />
        <FAB onTouchTap={() => this.openAddLightbulbModal()} />
      </div>
    );
  }
}
