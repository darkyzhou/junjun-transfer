const startupSignalServer = require('./lib/signal-server');
const startupIceServer = require('./lib/ice-server');
const startupIceAdvertiser = require('./lib/ice-advertiser');

startupSignalServer();
startupIceServer();
startupIceAdvertiser();
// TODO: error check
