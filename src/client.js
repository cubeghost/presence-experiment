import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'class-autobind';
import { isEmpty, map } from 'lodash';
import io from 'socket.io-client';
import debounce from 'debounce';

import events from './events';

const MOUSE_DEBOUNCE = 50;

const User = ({ username, position }) => (
  <div style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    border: '1px solid black',
    padding: '2px',
    transform: `translate(${position.x}px,${position.y}px)` 
  }}>
    <span>{username}</span>
  </div>
);

class Client extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      socketId: null,
      isConnected: false,
      isUsernameSet: false,
      username: '',
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
    this.socket.on('disconnect', reason => {
      console.log('disconnect', reason);
    });

    // set up event listeners
    window.addEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
  }

  componentWillUnmount() {
    // clean up socket
    this.socket.close();
    this.socket = null;

    // clean up event listeners
    window.removeEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.removeEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
  }

  handleUsernameInput(event) {
    this.setState({
      username: event.target.value
    });
  }

  confirmUsername(event) {
    event.preventDefault();

    const { username } = this.state;

    if (!isEmpty(username)) {
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
      this.socket.emit(events.setPosition, { x: event.pageX, y: event.pageY }, cool => {
        if (cool == false) {
          this.setState({ isConnected: false });
        }
      });
    }
  }

  render() {
    const { socketId, isConnected, isUsernameSet, username, users } = this.state;

    return (
      <div>
        <h1>hi</h1>
        {!isConnected && (
          <p style={{ color: 'red' }}>disconnected</p>
        )} 
        <p>
          your socket id is {socketId}
        </p>
        {isUsernameSet && (
          <p>your username is {username}</p>
        )}
        {!isUsernameSet && (
          <form onSubmit={this.confirmUsername}>
            <label htmlFor="username">name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.handleUsernameInput}
            />
            <button onClick={this.confirmUsername}>ok</button>
          </form>
        )}
        {map(users, user => {
          if (!user.position) return null;

          return <User username={user.username} position={user.position} key={user.id} />;
        })}
      </div>
    );
  }
}

ReactDOM.render(<Client />, document.querySelector('#react-root'));
