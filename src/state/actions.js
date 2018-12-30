import { flow, isEmpty, trim } from 'lodash/fp';

const isStringEmpty = flow(trim, isEmpty);


/**
 * action types
 */
export const SERVER_ACTION_PREFIX = 'server/';

export const UPDATE_USERS = 'USERS/update';
export const UPDATE_MESSAGES = 'MESSAGES/update';

export const IDENTIFY = `${SERVER_ACTION_PREFIX}USER/identify`;
export const SET_POSITION = `${SERVER_ACTION_PREFIX}USER/setPosition`;

export const SET_USERNAME = `SELF/setUsername`;
export const SET_CURSOR = `SELF/setCursor`;

export const SEND_MESSAGE = `${SERVER_ACTION_PREFIX}MESSAGES/send`;

export const SET_SOCKET_ID = 'CONNECTION/setSocketId';
export const SET_IS_CONNECTED = 'CONNECTION/setIsConnected';


/**
 * action creators
 */
export const setUsername = username => ({
  type: SET_USERNAME,
  data: { username },
});

export const setCursor = cursor => ({
  type: SET_CURSOR,
  data: { cursor },
});

export const setPosition = ({ x, y }) => (dispatch, getState) => {
  const { connection: { isIdentified } } = getState();
  if (isIdentified) {
    dispatch({
      type: SET_POSITION,
      data: { x, y },
    });
  } else {
    return null;
  }
};

export const identify = () => (dispatch, getState) => {
  // Emit username and cursor at the same time to avoid weirdness
  console.log('IDENTIFY')
  const { self: { username, cursor } } = getState();
  if (!isStringEmpty(username) && cursor) {
    console.log('IDENTIFY dispatch')
    dispatch({
      type: IDENTIFY,
      data: {
        username,
        cursor,
      }
    });
  } else {
    // TODO return validation error or s/t
    return null;
  }
};

export const sendMessage = message => ({
  type: SEND_MESSAGE,
  data: { message },
});

export const setSocketId = socketId => ({
  type: SET_SOCKET_ID,
  data: { socketId },
});

export const socketConnect = () => ({
  type: SET_IS_CONNECTED,
  data: { isConnected: true, }
});

export const socketDisconnect = () => ({
  type: SET_IS_CONNECTED,
  data: { isConnected: false, }
});