import { flow, isEmpty, trim } from 'lodash/fp';

import * as actionTypes from 'state/actionTypes';

const isStringEmpty = flow(trim, isEmpty);


/**
 * action creators
 */
export const setUsername = username => ({
  type: actionTypes.SET_USERNAME,
  data: { username },
});

export const setCursor = cursor => ({
  type: actionTypes.SET_CURSOR,
  data: { cursor },
});

export const setPosition = ({ x, y }) => (dispatch, getState) => {
  const { connection: { isIdentified } } = getState();
  if (isIdentified) {
    dispatch({
      type: actionTypes.SET_POSITION,
      data: { x, y },
    });
  } else {
    return null;
  }
};

export const setShouldPersistIdentity = shouldPersistIdentity => ({
  type: actionTypes.SET_SHOULD_PERSIST_IDENTITY,
  data: { shouldPersistIdentity },
});

export const identify = () => (dispatch, getState) => {
  // Emit username and cursor at the same time to avoid weirdness
  const { self: { username, cursor } } = getState();
  if (!isStringEmpty(username) && cursor) {
    dispatch({
      type: actionTypes.IDENTIFY,
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

export const clearIdentity = () => ({
  type: actionTypes.CLEAR_IDENTITY,
});

export const sendMessage = message => ({
  type: actionTypes.SEND_MESSAGE,
  data: { message },
});

export const setSocketId = socketId => ({
  type: actionTypes.SET_SOCKET_ID,
  data: { socketId },
});

export const socketConnect = () => ({
  type: actionTypes.SET_IS_CONNECTED,
  data: { isConnected: true, }
});

export const socketDisconnect = () => ({
  type: actionTypes.SET_IS_CONNECTED,
  data: { isConnected: false, }
});