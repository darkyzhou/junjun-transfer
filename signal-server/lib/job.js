module.exports = class Job {
  constructor(id, onDestroy) {
    this.id = id;
    this.onDestroy = onDestroy;
    this.senderSocket = null;
    this.cachedSenderCandidates = [];
    this.receiverSocket = null;
  }

  setSenderSocket(socket) {
    if (!socket) {
      throw new Error('sender socket cannot be empty');
    }
    if (this.senderSocket !== socket) {
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
        this.receiverSocket.emit('SIGNAL_CANDIDATE', { candidate });
      }
    });
    socket.on('SIGNAL_OFFER', ({ offer }) => {
      this.receiverSocket.emit('SIGNAL_OFFER', { offer });
    });
    socket.on('disconnect', (reason) => {
      console.log(`[job#${this.id}] sender socket ${socket.id} disconnected, reason: ${reason}`);
      this.receiverSocket?.emit('EVENT_PEER_LEFT');
      this.senderSocket = null;
      this.checkDestroy();
    });
  }

  setReceiverSocket(socket) {
    if (!socket) {
      throw new Error('receiver socket cannot be empty');
    }
    if (this.receiverSocket && this.receiverSocket !== socket) {
      throw new Error('duplicate receiver socket with the same job id');
    }
    if (this.receiverSocket === socket) {
      return;
    }

    this.receiverSocket = socket;
    socket.on('SIGNAL_CANDIDATE', ({ candidate }) => {
      this.senderSocket.emit('SIGNAL_CANDIDATE', { candidate });
    });
    socket.on('SIGNAL_ANSWER', ({ answer }) => {
      this.senderSocket.emit('SIGNAL_ANSWER', { answer });
    });
    socket.on('disconnect', (reason) => {
      console.log(`[job#${this.id}] receiver socket ${socket.id} disconnected, reason: ${reason}`);
      this.senderSocket?.emit('EVENT_PEER_LEFT');
      this.receiverSocket = null;
      this.checkDestroy();
    });
    socket.on('EVENT_RECEIVER_PROGRESS', ({ speed, received, total, finished }) =>
      this.senderSocket?.emit('EVENT_RECEIVER_PROGRESS', { speed, received, total, finished })
    );
  }

  checkDestroy() {
    if (!this.senderSocket && !this.receiverSocket) {
      console.log(`[job#${this.id}] destroyed due to disconnected sender and receiver`);
      this.onDestroy();
    }
  }
};
