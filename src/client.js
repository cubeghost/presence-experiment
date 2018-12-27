import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import io from 'socket.io-client';
import autobind from 'class-autobind';
import { map } from 'lodash';
import { flow, isEmpty, trim } from 'lodash/fp';
import debounce from 'debounce';

import SocketProvider from 'components/socket';
import initialState from 'state/initial';
import configureStore from 'state/store';
import { setUsername, setPosition, sendMessage } from 'state/actions';

const MOUSE_DEBOUNCE = 10;
const isStringEmpty = flow(trim, isEmpty);

const socket = io();
const store = configureStore(initialState, socket);

const mapStateToProps = state => {
  return {
    users: state.users,
    messages: state.messages,
    errors: state.errors,
    socketId: state.connection.socketId,
    isConnected: state.connection.isConnected,
  }
};
const mapDispatchToProps = dispatch => ({
  dispatchSetUsername: username => dispatch(setUsername(username)),
  dispatchSetPosition: position => dispatch(setPosition(position)),
  dispatchSendMessage: message => dispatch(sendMessage(message)),
})

const User = (props) => {
  const { 
    username, 
    position, 
    isInputMode, // this is getting out of hand, time for redux soon
    message,
    sendMessage,
    handleMessageInput,
  } = props;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate(${position.x}px,${position.y}px)`
    }}>

      <p style={{
        border: '1px solid black',
        padding: '4px',
        display: 'table',
        margin: '0.5em 0',
      }}>
        {username}
      </p>

      {isInputMode && (
        <form onSubmit={sendMessage}>
          <input
            type="text"
            autoFocus={true}
            id="message"
            value={message}
            onChange={handleMessageInput}
          />
        </form>
      )}

    </div>
  );
};

class Client extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      isUsernameSet: false,
      isTyping: false,
      username: '',
      message: '',
    };
  }

  componentDidMount() {
    // set up socket
    // const socket = io();
    // this.socket = socket;
    // this.socket.on('connect', () => {
    //   this.setState({
    //     socketId: socket.id,
    //     isConnected: true,
    //   });
    // });
    // this.socket.on('reconnect', () => {
    //   this.setState({
    //     socketId: this.socket.id,
    //     isConnected: true,
    //   });
    //   this.setUsername();
    // })
    // this.socket.on('disconnect', reason => {
    //   console.error('disconnect', reason);
    //   this.setState({ isConnected: false });
    // });

    // set up event listeners
    window.addEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    // clean up event listeners
    window.removeEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.removeEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.removeEventListener('click', this.handleClick);
 }

  handleUsernameInput(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleMessageInput(event) {
    this.setState({
      message: event.target.value
    });
  }

  sendMessage(event) {
    if (event) event.preventDefault();

    const { message } = this.state;
    const { dispatchSendMessage } = this.props;
 
    const resetState = {
      isTyping: false,
      message: ''
    };

    if (!isStringEmpty(message)) {
      dispatchSendMessage(message);
      this.setState(resetState);
    } else {
      this.setState(resetState);
    }
  }

  setUsername(event) {
    if (event) event.preventDefault();

    const { username } = this.state;
    const { dispatchSetUsername } = this.props;

    if (!isStringEmpty(username)) {
      dispatchSetUsername(username);
      this.setState({ isUsernameSet: true });
    }
  }

  handleMouseEvent(event) {
    const { isConnected, dispatchSetPosition } = this.props;
    const { isUsernameSet } = this.state;

    if (isUsernameSet && isConnected) {
      dispatchSetPosition({ 
        x: event.pageX, 
        y: event.pageY 
      });
    }
  }

  handleClick(event) {
    const { isConnected } = this.props;
    const { isUsernameSet, isTyping } = this.state;

    if (isConnected && isUsernameSet) {
      this.setState({ isTyping: !isTyping });
    }
  }

  render() {
    const { socketId, isConnected, users } = this.props;
    const { isUsernameSet, isTyping, username, message } = this.state;

    return (
      <div>
        <h1>ephemeral web presence space</h1>
        {!isConnected && (
          <p style={{ color: 'red' }}>disconnected</p>
        )} 
        <p>
          your socket id is {socketId}
        </p>
        {isUsernameSet && (
          <Fragment>
            <p>your username is {username}</p>
            <p>click to type messages</p>
          </Fragment>
        )}
        {!isUsernameSet && (
          <form onSubmit={this.setUsername}>
            <label htmlFor="username" style={{ marginRight: '0.5em' }}>name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.handleUsernameInput}
            />
            <button onClick={this.setUsername}>ok</button>
          </form>
        )}
        {map(users, user => {
          if (!user.position) return null;
          const isInputMode = (user.id === socketId && isTyping);

          return (
            <User 
              username={user.username} 
              position={user.position} 
              isInputMode={isInputMode}
              message={message}
              handleMessageInput={this.handleMessageInput}
              sendMessage={this.sendMessage}
              key={user.id} 
            />
          );
        })}
      </div>
    );
  }
}

const ConnectedClient = connect(mapStateToProps, mapDispatchToProps)(Client);

const App = () => (
  <Provider store={store}>
    <SocketProvider socket={socket}>
      <ConnectedClient />
    </SocketProvider>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#react-root'));
