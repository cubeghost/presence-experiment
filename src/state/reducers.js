import { assign } from 'lodash';
import { combineReducers } from 'redux';

import initialState from 'state/initial';
import * as actionTypes from 'state/actions';

const selfReducer = (state = initialState.self, action) => {
  switch (action.type) {
    case actionTypes.SET_USERNAME:
      return assign({}, state, { 
        username: action.data.username,
      });
    case actionTypes.SET_CURSOR:
      return assign({}, state, {
        cursor: action.data.cursor
      });
    case actionTypes.SET_POSITION:
      return assign({}, state, {
        position: { 
          x: action.data.x,  
          y: action.data.y,
        }});
    default:
      return state;
  }
};

const usersReducer = (state = initialState.users, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_USERS:
      // Because of disconnects, we don't actually want to use assign here
      return action.data.users;
    default:
      return state;
  }
};

const messagesReducer = (state = initialState.messages, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_MESSAGES:
      return action.data.messages;
    default:
      return state;
  }
};

const errorsReducer = (state = initialState.errors, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const connectionReducer = (state = initialState.connection, action) => {
  switch (action.type) {
    case actionTypes.SET_IS_CONNECTED:
      return assign({}, state, { isConnected: action.data.isConnected });
    case actionTypes.SET_SOCKET_ID:
      return assign({}, state, { socketId: action.data.socketId });
    case actionTypes.IDENTIFY:
      return assign({}, state, { isIdentified: true });
    default:
      return state;
  }
};

const reducers = combineReducers({
  self: selfReducer,
  users: usersReducer,
  messages: messagesReducer,
  errors: errorsReducer,
  connection: connectionReducer,
});

export default reducers;
