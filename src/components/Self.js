import React, { Component } from 'react';
import autobind from 'class-autobind';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { flow, isEmpty, trim } from 'lodash/fp';

import { sendMessage } from 'state/actions';

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
    const { isIdentified, isConnected } = this.props;
    const { isInputEnabled } = this.state;

    if (isIdentified && isConnected) {
      this.setState({ isInputEnabled: !isInputEnabled });
    }
  }

  handleInput(event) {
    this.setState({
      message: event.target.value,
    });
  }

  sendMessage(event) {
    if (event) event.preventDefault();

    const { dispatchSendMessage } = this.props;
    const { message } = this.state;

    const resetState = {
      isInputEnabled: false,
      message: ''
    };

    if (!isStringEmpty(message)) {
      dispatchSendMessage(message);
      this.setState(resetState);
    } else {
      this.setState(resetState);
    }
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