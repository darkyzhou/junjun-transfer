module.exports = class Job {
  constructor(id, onDestroy) {
    this.id = id;
    this.onDestroy = onDestroy;
    this.senderSocket = null;
    this.receiverSocket = null;
    this.cachedSenderOffer = null;
    this.receiverLeft = false;
    this.cachedSenderCandidates = [];
  }

  setSenderSocket(socket) {
    if (!socket) {
      throw new Error('sender socket cannot be empty');
    }
    if (this.senderSocket && this.senderSocket !== socket) {
      throw new Error('duplicate sender socket with the same job id');
    }
    if (this.senderSocket === socket) {
      return;
    }

    this.senderSocket = socket;
    socket.on('SIGNAL_CANDIDATE', ({ candidate }) => {
      if (!this.receiverSocket) {
        this.cachedSenderCandidates.push(candidate);
      } else {
        this.receiverSocket.emit('SIGNAL_CANDIDATE', { candidates: [candidate] });
      }
    });
    socket.on('SIGNAL_OFFER', ({ offer }) => {
      if (!this.receiverSocket) {
        this.cachedSenderOffer = offer;
      } else {
        this.receiverSocket.emit('SIGNAL_OFFER', { offer });
      }
    });
    socket.on('disconnect', (reason) => {
      console.log(`[job#${this.id}] sender socket ${socket.id} disconnected, reason: ${reason}`);
      this.receiverSocket?.emit('EVENT_PEER_LEFT');
      this.senderSocket = null;
      this.checkDestroy();
    });
  }

  setReceiverSocket(socket) {
    if (this.receiverSocket && this.receiverSocket !== socket) {
      throw new Error('俊俊快传仅支持一对一传输');
    }
    if (this.receiverLeft) {
      throw new Error('暂不支持在使用中途刷新浏览器页面');
    }
    if (this.receiverSocket === socket) {
      return;
    }

    this.receiverSocket = socket;
    if (this.cachedSenderCandidates.length > 0) {
      socket.emit('SIGNAL_CANDIDATE', { candidates: this.cachedSenderCandidates });
      this.cachedSenderCandidates = [];
    }
    if (this.cachedSenderOffer) {
      socket.emit('SIGNAL_OFFER', { offer: this.cachedSenderOffer });
    }

    socket.on('SIGNAL_CANDIDATE', ({ candidate }) => {
      this.senderSocket?.emit('SIGNAL_CANDIDATE', { candidates: [candidate] });
    });
    socket.on('SIGNAL_ANSWER', ({ answer }) => {
      this.senderSocket?.emit('SIGNAL_ANSWER', { answer });
    });
    socket.on('disconnect', (reason) => {
      console.log(`[job#${this.id}] receiver socket ${socket.id} disconnected, reason: ${reason}`);
      this.senderSocket?.emit('EVENT_PEER_LEFT');
      this.receiverSocket = null;
      this.receiverLeft = true;
      this.checkDestroy();
    });
    socket.on('EVENT_RECEIVER_PROGRESS', ({ avgSpeed, speed, current, goal }) =>
      this.senderSocket?.emit('EVENT_RECEIVER_PROGRESS', { avgSpeed, speed, current, goal })
    );
  }

  checkDestroy() {
    if (!this.senderSocket && !this.receiverSocket) {
      console.log(`[job#${this.id}] destroyed due to disconnected sender and receiver`);
      this.onDestroy();
    }
  }
};
