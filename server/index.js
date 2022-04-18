const startupSignalServer = require('./lib/signal-server');
const startupIceAdvertiser = require('./lib/ice-advertiser');
const { addExitHook } = require('exit-hook-plus');

startupSignalServer();
startupIceAdvertiser();
addExitHook(() => console.log('exiting...'));
