const Turn = require('node-turn');

module.exports = () => {
  const iceServer = new Turn({
    authMech: 'none',
    debugLevel: 'INFO'
  });

  // ice server will listen on udp port 3478 by default
  iceServer.start();
};
