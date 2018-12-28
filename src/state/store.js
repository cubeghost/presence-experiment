import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import thunk from 'redux-thunk';

import { SERVER_ACTION_PREFIX } from 'state/actions';
import reducers from 'state/reducers';

const ENABLE_REDUX_DEVTOOLS =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  process.env.NODE_ENV !== 'production';
const composeEnhancers = ENABLE_REDUX_DEVTOOLS
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

export default function configureStore(initialState, socket) {
  const socketIoMiddleware = createSocketIoMiddleware(socket, SERVER_ACTION_PREFIX);

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(thunk, socketIoMiddleware))
  );

  return store;
}
