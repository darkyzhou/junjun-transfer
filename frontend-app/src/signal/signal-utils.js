import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';

function makeJobId() {
  return nanoid(12);
}

export function makeSenderSocket() {
  return io({
    transports: ['websocket'],
    path: '/signal/sender',
    query: {
      jobId: makeJobId()
    }
  });
}

export function makeReceiverSocket(jobId) {
  return io({
    transports: ['websocket'],
    path: '/signal/receiver',
    query: {
      jobId
    }
  });
}
