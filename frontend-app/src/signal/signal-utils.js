import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';

export function makeJobId() {
  return nanoid(12);
}

export function makeSenderSocket(jobId) {
  return io({
    transports: ['websocket'],
    path: '/signal/sender',
    query: {
      jobId
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
