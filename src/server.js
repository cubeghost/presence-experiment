require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const debugModule = require('debug');

const actionTypes = require('./state/actions');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const buildDir = path.resolve('build');

app.use(express.static(buildDir));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(buildDir, '/index.html'));
});

const ACTION = 'action';

const users = {}; // TODO how to clean up????
const messages = [];

io.on('connection', socket => {
  const debug = debugModule('presence:user');

  debug(`a user connected ${socket.id}`);

  socket.emit(ACTION, {
    type: actionTypes.UPDATE_USERS,
    data: { users }
  });
  socket.emit(ACTION, {
    type: actionTypes.UPDATE_MESSAGES,
    data: { messages }
  });

  socket.on(ACTION, ({ type, data }) => {
    switch (type) {

      case actionTypes.SET_USERNAME:
        const { username } = data;
        users[socket.id] = {
          id: socket.id,
          username: username,
          cursor: null,
          position: null,
        };
        
        debug(`user ${socket.id} set username to "${username}"`);

        io.emit(ACTION, { 
          type: actionTypes.UPDATE_USERS, 
          data: { users } 
        });
        break;

      case actionTypes.SET_POSITION:
        if (!users[socket.id]) return;

        const { x, y } = data;
        users[socket.id].position = { x, y };

        io.emit(ACTION, {
          type: actionTypes.UPDATE_USERS,
          data: { users }
        });
        break;

      case actionTypes.SEND_MESSAGE:
        if (!users[socket.id]) return;

        const { message } = data;
        messages.push({
          user: socket.id,
          username: users[socket.id].username,
          body: message,
          sentAt: Math.floor(new Date() / 1000),
        });

        debug(`${users[socket.id].username} said: "${message}"`);

        io.emit(ACTION, {
          type: actionTypes.UPDATE_MESSAGES,
          data: { messages }
        });
       break;
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];

    debug(`user ${socket.id} disconnected`);

    io.emit(ACTION, {
      type: actionTypes.UPDATE_USERS,
      data: { users }
    });
  });
});

server.listen(process.env.PORT, () => {
  const debug = debugModule('presence:server');
  debug(`http://localhost:${process.env.PORT}/`);
});
