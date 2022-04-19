const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const { JobController } = require('./lib/job-controller');
const servers = require('./config/ice-servers.json'); // TODO: should check validity

const app = express();
const http = createServer(app);

app.get('/ice', (_, res) => {
  res.header('content-type', 'application/json; charset=utf-8').send(servers);
});
if (!process.env.DISABLE_STATIC) {
  app.use('/', expressStaticGzip('./public'));
}

const senderWs = new Server(http, { path: '/signal/sender' });
const receiverWs = new Server(http, { path: '/signal/receiver' });
const controller = new JobController(senderWs, receiverWs);
controller.init();

http.listen(8080, () => {
  console.log('[server] started listening on port 8080');
});

process.on('SIGTERM', () => {
  debug('[server] SIGTERM signal received: closing HTTP server');
  http.close();
});
