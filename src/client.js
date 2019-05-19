import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import io from 'socket.io-client';
import autobind from 'class-autobind';
import { map } from 'lodash';
import debounce from 'debounce';
import { PersistGate } from 'redux-persist/integration/react';

import SocketProvider from 'components/SocketProvider';
import Messages from 'components/Messages';
import Identify from 'components/Identify';
import User from 'components/User';
import Self from 'components/Self';
import World from 'components/World';
import About from 'components/About';

import initialState from 'state/initial';
import configureStore from 'state/store';
import { setPosition, clearIdentity } from 'state/actionCreators';

import 'style.css';


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
      <div className="container" style={{ 
        cursor: isIdentified ? 'none' : 'default',
      }}>
        <div className="box header">
          <h1>ephemeral web presence space</h1>
          <About />
        </div>
        <div className="glitch-buttons">
          <a href="https://glitch.com/edit/#!/ephemeral-presence">
            <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fview-source%402x.png?1513093958802" alt="view source" height="33" />
          </a>
          &nbsp;
          <a href="https://glitch.com/edit/#!/remix/ephemeral-presence">
            <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix this" height="33" />
          </a>
        </div>
        <div className="box identity">
          {!isConnected && (
            <p style={{ color: 'red' }}>disconnected</p>
          )} 
          {isIdentified && (
            <Fragment>
              <p>
                your username is <strong>{username}</strong>
                <button className="box log-out" onClick={dispatchClearIdentity}>
                  log out
                </button>
              </p>
              <p>click to type messages</p>
            </Fragment>
          )}
          {!isIdentified && <Identify />}
        </div>
        {map(users, user => {
          if (user.id === socketId) return null;

          return (
            <User 
              username={user.username} 
              position={user.position} 
              cursor={user.cursor} 
              typing={user.typing} 
              key={user.id} 
            />
          );
        })}
        <Self />
        <Messages />
        <World />
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
