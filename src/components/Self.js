import React, { Component } from 'react';
import autobind from 'class-autobind';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { flow, isEmpty, trim } from 'lodash/fp';

import { sendMessage, setTyping } from 'state/actionCreators';

import { CURSORS } from 'consts';
import { getPositionStyle } from 'utils';

const isStringEmpty = flow(trim, isEmpty);

const mapStateToProps = state => ({
  username: state.self.username,
  position: state.self.position,
  cursor: state.self.cursor,
  isConnected: state.connection.isConnected,
  isIdentified: state.connection.isIdentified,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetTyping: message => dispatch(setTyping(message)),
  dispatchSendMessage: message => dispatch(sendMessage(message)),
});

class Self extends Component {

  constructor() {
    super();
    autobind(this);

    this.state = {
      message: '',
      isInputEnabled: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick);
  }

  handleClick() {
    const { isIdentified, isConnected, dispatchSetTyping } = this.props;
    const { isInputEnabled } = this.state;

    if (isIdentified && isConnected) {
      if (isInputEnabled) {
        dispatchSetTyping(null);
      }
      this.setState({ isInputEnabled: !isInputEnabled });
    }
  }

  handleInput(event) {
    const { dispatchSetTyping } = this.props;
    const message = event.target.value;
    
    this.setState({ message });
    dispatchSetTyping(message);
  }
  
  reset() {
    const { dispatchSetTyping } = this.props;
    
    dispatchSetTyping(null);
    
    this.setState({
      isInputEnabled: false,
      message: ''
    });
  }

  sendMessage(event) {
    if (event) event.preventDefault();

    const { dispatchSendMessage } = this.props;
    const { message } = this.state;

    if (!isStringEmpty(message)) {
      dispatchSendMessage(message);
    }
    
    this.reset();
  }

  render() {
    const { username, position, cursor, isIdentified } = this.props;
    const { message, isInputEnabled } = this.state;

    if (!isIdentified || !position || !username) return null;

    return (
      <div style={{ ...getPositionStyle(position), pointerEvents: 'none' }}>

        <img src={get(CURSORS, `${cursor}.file`)} />

        <span style={{ marginLeft: '0.25em' }}>{username}</span>

        {isInputEnabled && (
          <form onSubmit={this.sendMessage}>
            <input
              type="text"
              autoFocus={true}
              id="message"
              value={message}
              onChange={this.handleInput}
            />
          </form>
        )}

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Self);