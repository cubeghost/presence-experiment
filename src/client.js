import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
import { map } from 'lodash';
import { flow, sortBy, filter, reverse, slice, isEmpty, trim } from 'lodash/fp';
import io from 'socket.io-client';
import debounce from 'debounce';

import events from './events';

const MOUSE_DEBOUNCE = 10;
const MESSAGE_EXPIRY = 30;
const isStringEmpty = flow(trim, isEmpty);

const User = (props) => {
  const { 
    username, 
    position, 
    messages,
    isInputMode, // this is getting out of hand, time for redux soon
    message,
    sendMessage,
    handleMessageInput,
  } = props;

  const now = Math.floor(new Date() / 1000);
  const recentMessages = flow(
    filter(message => ((now - message.sentAt) < MESSAGE_EXPIRY)), // TODO expire on the server
    sortBy('sentAt'),
    reverse,
    slice(0, 3),
    reverse,
  )(messages);  

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate(${position.x}px,${position.y}px)`
    }}>

      {recentMessages.length > 0 && ( 
        <div style={{
          position: 'absolute',
          top: 0,
          transform: 'translateY(-100%)',
          opacity: 0.5,
          width: '200px',
        }}>
          {map(recentMessages, message => (
            <p key={`message-${username}-${message.sentAt}`} style={{ margin: 0 }}>
              "{message.body}"
            </p>
          ))}
        </div>
      )}

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
      socketId: null,
      isConnected: false,
      isUsernameSet: false,
      isTyping: false,
      username: '',
      message: '',
      users: {}
    };
  }

  componentDidMount() {
    // set up socket
    const socket = io();
    this.socket = socket;
    this.socket.on('connect', () => {
      this.setState({
        socketId: socket.id,
        isConnected: true,
      });
    });
    this.socket.on(events.updateUsers, users => {
      this.setState({ users });
    });
    this.socket.on('reconnect', () => {
      this.setState({
        socketId: this.socket.id,
        isConnected: true,
      });
      this.setUsername();
    })
    this.socket.on('disconnect', reason => {
      console.error('disconnect', reason);
      this.setState({ isConnected: false });
    });

    // set up event listeners
    window.addEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    // clean up socket
    this.socket.close();
    this.socket = null;

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
    const resetState = {
      isTyping: false,
      message: ''
    };

    if (!isStringEmpty(message)) {
      this.socket.emit(events.sendMessage, { message }, cool => {
        this.setState(resetState);
      });
    } else {
      this.setState(resetState);
    }
  }

  setUsername(event) {
    if (event) event.preventDefault();

    const { username } = this.state;

    if (!isStringEmpty(username)) {
      this.socket.emit(events.setUsername, { username }, cool => {
        if (cool == true) {
          this.setState({ isUsernameSet: true });
        }
      });
    }
  }

  handleMouseEvent(event) {
    const { isUsernameSet, isConnected } = this.state;

    if (isUsernameSet && isConnected) {
      this.socket.emit(events.setPosition, { x: event.pageX, y: event.pageY });
    }
  }

  handleClick(event) {
    const { isConnected, isUsernameSet, isTyping } = this.state;

    if (isConnected && isUsernameSet) {
      this.setState({ isTyping: !isTyping });
    }
  }

  render() {
    const { socketId, isConnected, isUsernameSet, isTyping, username, message, users } = this.state;

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
              messages={user.messages}
              isInputMode={isInputMode}
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

ReactDOM.render(<Client />, document.querySelector('#react-root'));
