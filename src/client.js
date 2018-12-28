import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import io from 'socket.io-client';
import autobind from 'class-autobind';
import { map } from 'lodash';
import debounce from 'debounce';

import SocketProvider from 'components/SocketProvider';
import Messages from 'components/Messages';
import User from 'components/User';
import Self from 'components/Self';

import initialState from 'state/initial';
import configureStore from 'state/store';
import { setUsername, setPosition, sendMessage } from 'state/actions';

import Identify from './components/Identify';

const MOUSE_DEBOUNCE = 10;

const socket = io();
const store = configureStore(initialState, socket);

const mapStateToProps = state => ({
  username: state.self.username,
  cursor: state.self.cursor,
  users: state.users,
  messages: state.messages,
  errors: state.errors,
  socketId: state.connection.socketId,
  isConnected: state.connection.isConnected,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetUsername: username => dispatch(setUsername(username)),
  dispatchSetPosition: position => dispatch(setPosition(position)),
  dispatchSendMessage: message => dispatch(sendMessage(message)),
});

class Client extends Component {
  constructor() {
    super();
    autobind(this);
  }

  componentDidMount() {
    // set up event listeners
    window.addEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.addEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
  }

  componentWillUnmount() {
    // clean up event listeners
    window.removeEventListener('mouseenter', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
    window.removeEventListener('mousemove', debounce(this.handleMouseEvent, MOUSE_DEBOUNCE));
 }

  handleMouseEvent(event) {
    const { username, isConnected, dispatchSetPosition } = this.props;

    if (username && isConnected) {
      dispatchSetPosition({ 
        x: event.pageX, 
        y: event.pageY 
      });
    }
  }

  render() {
    const { socketId, isConnected, users, username, cursor } = this.props;

    return (
      <div style={{ 
        width: '100vw',
        height: '100vh',
        cursor: !!cursor ? 'none' : 'default',
        boxSizing: 'border-box',
        padding: '0.5em',
      }}>
        <h1 style={{ marginTop: 0 }}>ephemeral web presence space</h1>
        {!isConnected && (
          <p style={{ color: 'red' }}>disconnected</p>
        )} 
        <p>
          your socket id is {socketId}
        </p>
        {username && (
          <Fragment>
            <p>your username is <strong>{username}</strong></p>
            <p>click to type messages</p>
          </Fragment>
        )}
        {!username && <Identify />}
        {map(users, user => {
          if (user.id === socketId) return null;

          return (
            <User 
              username={user.username} 
              position={user.position} 
              cursor={user.cursor} 
              key={user.id} 
            />
          );
        })}
        <Self />
        <Messages />
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
