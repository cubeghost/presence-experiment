require('dotenv').config({ debug: true });

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const debugModule = require('debug');

const { MessageClient, UserClient } = require('./redis');
const actionTypes = require('../state/actionTypes');

const app = express();
/* eslint-disable new-cap */
const server = require('http').Server(app);
const io = require('socket.io')(server);

const buildDir = path.resolve('build');

app.use(express.static(buildDir));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(buildDir, '../index.html'));
});

const ACTION = 'action';

const userClient = new UserClient();
const messageClient = new MessageClient();

io.on('connection', async socket => {
  const debug = debugModule('presence:user');

  debug(`a user connected ${socket.id}`);

  socket.emit(ACTION, {
    type: actionTypes.UPDATE_USERS,
    data: { users: await userClient.list() }
  });
  socket.emit(ACTION, {
    type: actionTypes.UPDATE_MESSAGES,
    data: { messages: await messageClient.list() }
  });

  socket.on(ACTION, async ({ type, data }) => {
    const user = await userClient.get(socket.id);

    switch (type) {
      case actionTypes.IDENTIFY:
        const { username, cursor } = data;

        const newUser = {
          id: socket.id,
          username: username,
          cursor: cursor,
          position: null,
        };
        await userClient.set(newUser);

        debug(`user ${socket.id} set username to "${username}" and cursor to "${cursor}"`);

        io.emit(ACTION, { 
          type: actionTypes.UPDATE_USERS, 
          data: { users: userClient.list() } 
        });
        break;

      case actionTypes.SET_POSITION:
        if (!user) return;

        const { x, y } = data;
        user.position = { x, y };

        await userClient.set(user);

        io.emit(ACTION, {
          type: actionTypes.UPDATE_USERS,
          data: { users: await userClient.list() }
        });
        break;

      case actionTypes.SEND_MESSAGE:
        if (!user) return;

        await messageClient.push({
          user: socket.id,
          username: user.username,
          body: data.message,
          sentAt: Math.floor(new Date() / 1000),
        });

        debug(`${user.username} said: "${data.message}"`);

        io.emit(ACTION, {
          type: actionTypes.UPDATE_MESSAGES,
          data: { messages: await messageClient.list() }
        });
        break;
      case actionTypes.CLEAR_IDENTITY:
        if (!user) return;

        await userClient.remove(user.id);

        debug(`user ${socket.id} cleared identity`);

        io.emit(ACTION, {
          type: actionTypes.UPDATE_USERS,
          data: { users: await userClient.list() }
        });
        break;
      default:
        break;
    }
  });

  socket.on('disconnect', async () => {
    await userClient.remove(socket.id);

    debug(`user ${socket.id} disconnected`);

    io.emit(ACTION, {
      type: actionTypes.UPDATE_USERS,
      data: { users: await userClient.list() }
    });
  });
});

server.listen(process.env.PORT, () => {
  const debug = debugModule('presence:server');
  debug(`http://localhost:${process.env.PORT}/`);
});

