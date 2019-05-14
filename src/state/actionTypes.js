/**
 * action types
 */
export const SERVER_ACTION_PREFIX = 'server/';

export const UPDATE_USERS = 'USERS/update';
export const UPDATE_MESSAGES = 'MESSAGES/update';

export const IDENTIFY = `${SERVER_ACTION_PREFIX}USER/identify`;
export const CLEAR_IDENTITY = `${SERVER_ACTION_PREFIX}USER/clearIdentity`;
export const SET_POSITION = `${SERVER_ACTION_PREFIX}USER/setPosition`;

export const SET_USERNAME = `SELF/setUsername`;
export const SET_CURSOR = `SELF/setCursor`;
export const SET_SHOULD_PERSIST_IDENTITY = `SELF/setShouldPersistIdentity`;

export const SEND_MESSAGE = `${SERVER_ACTION_PREFIX}MESSAGES/send`;

export const SET_SOCKET_ID = 'CONNECTION/setSocketId';
export const SET_IS_CONNECTED = 'CONNECTION/setIsConnected';
