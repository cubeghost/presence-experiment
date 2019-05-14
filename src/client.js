import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import io from 'socket.io-client';
import autobind from 'class-autobind';
import { map } from 'lodash';
import debounce from 'debounce';
import { PersistGate } from 'redux-persist/integration/react'

import SocketProvider from 'components/SocketProvider';
import Messages from 'components/Messages';
import User from 'components/User';
import Self from 'components/Self';

import initialState from 'state/initial';
import configureStore from 'state/store';
import { setPosition, clearIdentity } from 'state/actionCreators';

import Identify from './components/Identify';

const MOUSE_DEBOUNCE = 10;

const socket = io();
const { store, persistor } = configureStore(initialState, socket);

const mapStateToProps = state => ({
  username: state.self.username,
  users: state.users,
  messages: state.messages,
  errors: state.errors,
  socketId: state.connection.socketId,
  isConnected: state.connection.isConnected,
  isIdentified: state.connection.isIdentified,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetPosition: position => dispatch(setPosition(position)),
  dispatchClearIdentity: () => dispatch(clearIdentity()),
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
    const { isConnected, dispatchSetPosition } = this.props;

    if (isConnected) {
      dispatchSetPosition({ 
        x: event.pageX, 
        y: event.pageY 
      });
    }
  }

  render() {
    const { socketId, isConnected, isIdentified, users, username, dispatchClearIdentity } = this.props;

    return (
      <div style={{ 
        width: '100vw',
        height: '100vh',
        cursor: isIdentified ? 'none' : 'default',
        boxSizing: 'border-box',
        padding: '0.5em',
      }}>
        <h1 style={{ marginTop: 0 }}>ephemeral web presence space</h1>
        <p>
          <a href="https://github.com/cubeghost/presence-experiment" target="_blank">
            github.com/cubeghost/presence-experiment
          </a>
        </p>
        {!isConnected && (
          <p style={{ color: 'red' }}>disconnected</p>
        )} 
        <p>
          your socket id is {socketId}
        </p>
        {isIdentified && (
          <Fragment>
            <p>
              your username is <strong>{username}</strong>
              <button onClick={dispatchClearIdentity}>log out</button>
            </p>
            <p>click to type messages</p>
          </Fragment>
        )}
        {!isIdentified && <Identify />}
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
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider socket={socket}>
        <ConnectedClient />
      </SocketProvider>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<App />, document.querySelector('#react-root'));
