/*\
|*| The page header is a presentational component and is only responsible for
|*| displaying the big colorful header and some optional titles.
|*| This component is super simple because this app is simple, but it could be
|*| easily modifiable to support a range of use cases.
|*|
|*| This is a presentational (or "dumb") compnent. It's only responsible for
|*| rendering DOM nodes or other components. Presentation components should not
|*| include any logic.
\*/
import React from 'react';

// This component is in the React stateless function syntax.
// Basically it's just the render method you see in the React class syntax
// where the function argument are the component props.
// Notice I'm just passing all the props to the material-ui FAB so developers
// can take full advantage of its functionality
const PageHeader = ({ title, subtitle }) => (
  <div className="page-header">
    <div className="container">
      {title && <h1 className="page-header__title">{title}</h1>}
      {subtitle && <h2 className="page-header__subtitle">{subtitle}</h2>}
    </div>
  </div>
);

// Specify which types of props we expect to come into this component
React.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
};

export default PageHeader;
