const express = require('express');
const mongoose = require('mongoose');
const routes = require('../src/routes');
const http = require('http');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-xjll8.mongodb.net/mapweek10?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(express.json());
app.use(routes);

server.listen(3333);
