const io = require('socket.io');
const SocketMap = require('./lib/socket-map');

const signalServer = io({ path: '/signal' });
const socketMap = new SocketMap();
signalServer.on('connection', (socket) => {
  socket.on('SENDER_SUBMIT_ICE_CANDIDATE', ({ token, candidate }) => {
    socketMap.setSenderSocket(token, socket);
    socketMap.appendSenderCandidate(token, candidate);
    checkCandidateSender(token);
  });
  socket.on('RECEIVER_SUBMIT_ICE_CANDIDATE', ({ token, candidate }) => {
    socketMap.setReceiverSocket(token, socket);
    socketMap.appendReceiverCandidate(token, candidate);
    checkCandidateSender(token);
  });
  socket.on('SENDER_SUBMIT_OFFER', ({ token, offer }) => {
    socketMap.setSenderSocket(token, socket);
    socketMap.setSenderOffer(token, offer);
  });
  socket.on('RECEIVER_GET_OFFER', ({ token }) => {
    socketMap.setReceiverSocket(token, socket);
    socket.emit('RECEIVER_GET_OFFER_RESPONSE', { offer: socketMap.getSenderOffer(token) });
  });
  socket.on('RECEIVER_SUBMIT_ANSWER', ({ token, answer }) => {
    const { senderSocket } = socketMap.get(token);
    if (!senderSocket) {
      console.warn(`[signal] missing sender for token '${token}'`);
      return;
    }
    senderSocket.emit('SENDER_RECEIVE_ANSWER', { answer });
  });

  socket.on('disconnect', (reason) => {
    console.log(`[signal] socket ${socket.id} disconnected, reason: ${reason}`);
    socketMap.dropSocket(socket);
  });

  let candidateSenderId = null;

  function checkCandidateSender(token) {
    if (!candidateSenderId) {
      candidateSenderId = setTimeout(() => sendCandidate(token), 1500);
    }
  }

  function sendCandidate(token) {
    if (!socketMap.get(token)) {
      candidateSenderId = null;
      return;
    }

    const { senderSocket, receiverSocket } = socketMap.get(token);
    if (senderSocket) {
      const receiverCandidates = socketMap.getReceiverCandidates(token);
      if (receiverCandidates.length > 0) {
        senderSocket.emit('NEW_ICE_CANDIDATE', { candidates: receiverCandidates });
        console.log(
          `[signal] sent ${receiverCandidates.length} candidates to sender whose token is '${token}'`
        );
      }
    }

    if (receiverSocket) {
      const senderCandidates = socketMap.getSenderCandidates(token);
      if (senderCandidates.length > 0) {
        receiverSocket.emit('NEW_ICE_CANDIDATE', { candidates: senderCandidates });
        console.log(
          `[signal] sent ${senderCandidates.length} candidates to receiver whose token is '${token}'`
        );
      }
    }

    candidateSenderId = setTimeout(() => sendCandidate(token), 1500);
  }
});
signalServer.listen(4500);
console.log('[signal] listening port 4500');
