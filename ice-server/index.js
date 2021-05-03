const Turn = require("node-turn");

const server = new Turn({
  authMech: "none",
  debugLevel: "INFO"
});
server.start();
