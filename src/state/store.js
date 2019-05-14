import { createStore, applyMiddleware, compose } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { SERVER_ACTION_PREFIX } from 'state/actionTypes';
import initialState from 'state/initial';
import reducers from 'state/reducers';

const ENABLE_REDUX_DEVTOOLS =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  process.env.NODE_ENV !== 'production';
const composeEnhancers = ENABLE_REDUX_DEVTOOLS
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const conditionallyRehydrateIdentity = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState) => {
    if (inboundState.shouldPersistIdentity) {
      return { 
        ...inboundState,
        position: null, // never persist position
      };
    } else {
      return {
        ...inboundState,
        position: null,
        username: initialState.self.username,
        cursor: initialState.self.cursor,
      };
    }
  },
  // transform state being rehydrated
  (outboundState) => {
    if (outboundState.shouldPersistIdentity) {
      return {
        ...outboundState,
        position: null,
      };
    } else {
      return {
        ...outboundState,
        position: null,
        username: initialState.self.username,
        cursor: initialState.self.cursor,
      };
    }
  },
  { whitelist: ['self'] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['self'],
  transforms: [conditionallyRehydrateIdentity],
};

export default function configureStore(initialState, socket) {
  const socketIoMiddleware = createSocketIoMiddleware(socket, SERVER_ACTION_PREFIX);
  const persistedReducer = persistReducer(persistConfig, reducers);

  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, socketIoMiddleware))
  );

  const persistor = persistStore(store);

  return { 
    store,
    persistor
  };
}
