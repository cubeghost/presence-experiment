import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { flow, slice, sortBy } from 'lodash/fp';

const mapStateToProps = state => ({
  messages: flow(
    sortBy('sentAt'), 
    slice(0, 100)
  )(state.messages),
});

const Messages = ({ messages }) => (
  <div style={{ 
    opacity: 0.5,
    position: 'absolute',
    bottom: '0.5em' 
  }}>
    {map(messages, message => (
      <div key={`message-${message.user}-${message.sentAt}`}>
        <strong>{message.username}:</strong> {message.body}
      </div>
    ))}
  </div>
);

export default connect(mapStateToProps)(Messages);