import _ from 'lodash';
import { combineReducers } from 'redux';

import initialState from 'state/initial';
import * as actionTypes from 'state/actions';

// const selfReducer = (state = initialState.self, action) => {
//   switch (action.type) {
//     case actionTypes.SET_USERNAME:
//       return Object.assign({}, state, { username: action.data.username });
//     default:
//       return state;
//   }
// }

const usersReducer = (state = initialState.users, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_USERS:
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
      return Object.assign({}, state, { isConnected: action.data.isConnected });
    case actionTypes.SET_SOCKET_ID:
      return Object.assign({}, state, { socketId: action.data.socketId });
    default:
      return state;
  }
};

const reducers = combineReducers({
  users: usersReducer,
  messages: messagesReducer,
  errors: errorsReducer,
  connection: connectionReducer,
});

export default reducers;
