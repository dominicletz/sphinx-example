import React from 'react';

function getClassName(props) {
  const { error, info, warning } = props;

  let className = 'message';
  if (error) className += ' message--error';
  else if (info) className += ' message--info';
  else if (warning) className += ' message--warning';

  return className;
}

const MessageBox = props => (
  <div className={getClassName(props)}>
    {props.text}
  </div>
);

MessageBox.propTypes = {
  error: React.PropTypes.bool,
  info: React.PropTypes.bool,
  text: React.PropTypes.string,
  warning: React.PropTypes.bool,
};

export default MessageBox;
