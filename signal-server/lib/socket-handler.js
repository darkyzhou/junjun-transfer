const SocketMap = require('./socket-map');

module.exports = class {
  constructor(socket) {
    this.#socket = socket;
    this.#socketMap = new SocketMap();
  }

};
