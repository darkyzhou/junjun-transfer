const { createServer } = require('http');
const { Server } = require('socket.io');
const { JobController } = require('./job-controller');

module.exports = () => {
  const httpServer = createServer();
  const senderWs = new Server(httpServer, { path: '/signal/sender' });
  const receiverWs = new Server(httpServer, { path: '/signal/receiver' });
  const controller = new JobController(senderWs, receiverWs);
  controller.init();
  httpServer.listen(4500);
  console.log('[signal] started listening port 4500');
};
