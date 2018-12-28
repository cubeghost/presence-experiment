import React, { Component } from 'react';
import autobind from 'class-autobind';
import { connect } from 'react-redux';

import { sendMessage } from 'state/actions';

import { CURSORS } from 'consts';
import { getPositionStyle, isStringEmpty } from 'utils';

const mapStateToProps = state => ({
  username: state.self.username,
  position: state.self.position,
  cursor: state.self.cursor,
  isConnected: state.connection.isConnected,
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
    const { isConnected, username } = this.props;
    const { isInputEnabled } = this.state;

    if (username && isConnected) {
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
    const { username, position, cursor } = this.props;
    const { message, isInputEnabled } = this.state;

    if (!position || !username) return null;

    return (
      <div style={getPositionStyle(position)}>

        <img src={CURSORS[cursor].file} />

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