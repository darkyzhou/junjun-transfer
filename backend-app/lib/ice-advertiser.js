const express = require('express');
const app = express();
// TODO: should check validity
const servers = require('../config/ice-servers.json');

module.exports = () => {
  app.get('/ice', (req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.send(servers);
  });

  app.listen(4600, () => console.log('[ice-advertiser] listening on port 4600'));
};
