export default {
  self: {
    username: '',
    position: null,
    cursor: null,
    typing: null,
    shouldPersistIdentity: false,
  },
  users: {},
  messages: [],
  errors: [],
  connection: {
    socketId: null,
    isConnected: false,
    isIdentified: false,
  }
};
