/*\
|*| FAB - Floating Action Button
|*|
|*| The Floating Action Button is a material design creation. It's a circular
|*| button that is fixed above all other elements putting it outside the main
|*| page flow. The UI framework we're using - material-ui - has it's own FAB
|*| component, however, it is not in a fixed position. This component simply
|*| wraps the material-ui FAB component to give it positioning. Right now it's
|*| just fixed at the bottom right corner but it could be easily customizable
|*| to be positioned in any of the standard locations.
|*|
|*| This is a presentational (or "dumb") compnent. It's only responsible for
|*| rendering DOM nodes or other components. Presentation components should not
|*| include any logic.
\*/

// by convention, the imports are split into two groups, 3rd party libs and src
// modules. The imports in those groups are then ordered alphabetically by their
// source name (the string value on the right of "from").
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
// Although React isn't used anywhere, it's still necessary to import because
// it's used when the JSX syntax is transpiled.
import React from 'react';

// This component is in the React stateless function syntax.
// Basically it's just the render method you see in the React class syntax
// where the function argument are the component props.
// Notice I'm just passing all the props to the material-ui FAB so developers
// can take full advantage of its functionality
const FAB = props => (
  <div className="FAB-outer-container">
    <div className="FAB-inner-container">
      <FloatingActionButton
        className="FAB"
        secondary
        {...props}
      >
        <AddIcon />
      </FloatingActionButton>
    </div>
  </div>
);

export default FAB;
