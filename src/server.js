require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const debugModule = require('debug');
// const redis = require('redis');

const events = require('./events');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const client = redis.createClient(process.env.REDIS_URL);

const buildDir = path.resolve('build');

app.use(express.static(buildDir));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(buildDir, '/index.html'));
});

const users = {}; // TODO how to clean up????

io.on('connection', socket => {
  const debug = debugModule('presence:user');

  debug(`a user connected ${socket.id}`);

  socket.emit(events.updateUsers, users);

  socket.on(events.setUsername, ({ username }, cool) => {
    users[socket.id] = { 
      id: socket.id, 
      username: username, 
      position: null,
      messages: []
    };

    debug(`user ${socket.id} set username to "${username}"`);

    io.emit(events.updateUsers, users);

    cool(true);
  });

  socket.on(events.setPosition, ({ x, y }) => {
    if (!users[socket.id]) {
      return;
    }

    users[socket.id].position = { x, y };

    // debug(`${users[socket.id].username} moved`, x, y);

    io.emit(events.updateUsers, users);
  });

  socket.on(events.sendMessage, ({ message }, cool) => {
    if (!users[socket.id]) {
      cool(false);
      return;
    }

    users[socket.id].messages.push({ 
      body: message, 
      sentAt: Math.floor(new Date() / 1000) 
    });

    cool(true);

    debug(`${users[socket.id].username} said: "${message}"`);

    io.emit(events.updateUsers, users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];

    debug(`user ${socket.id} disconnected`);

    io.emit(events.updateUsers, users);
  });
});

server.listen(process.env.PORT, () => {
  const debug = debugModule('presence:server');
  debug(`http://localhost:${process.env.PORT}/`);
});
