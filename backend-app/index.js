const startupSignalServer = require('./lib/signal-server');
const startupIceAdvertiser = require('./lib/ice-advertiser');

startupSignalServer();
startupIceAdvertiser();
// TODO: error check
