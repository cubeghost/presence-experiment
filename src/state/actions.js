
export const SERVER_ACTION_PREFIX = 'server/';

export const UPDATE_USERS = 'USERS/update';
export const UPDATE_MESSAGES = 'MESSAGES/update';

export const SET_USERNAME = `${SERVER_ACTION_PREFIX}USER/setUsername`;
export const SET_POSITION = `${SERVER_ACTION_PREFIX}USER/setPosition`;

export const SEND_MESSAGE = `${SERVER_ACTION_PREFIX}MESSAGES/send`;

export const SET_SOCKET_ID = 'CONNECTION/setSocketId';
export const SET_IS_CONNECTED = 'CONNECTION/setIsConnected';


export const setUsername = username => ({
  type: SET_USERNAME,
  data: { username },
});

export const setPosition = ({ x, y }) => ({
  type: SET_POSITION,
  data: { x, y },
});

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
})