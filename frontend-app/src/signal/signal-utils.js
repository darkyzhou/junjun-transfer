import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';

export function makeJobId() {
  return nanoid(12);
}

const SOCKET_COMMON_CONFIG = {
  closeOnBeforeunload: false,
  autoConnect: false
};

export function makeSenderSocket(jobId) {
  return io({
    transports: ['websocket'],
    path: '/signal/sender',
    query: {
      jobId
    },
    ...SOCKET_COMMON_CONFIG
  });
}

export function makeReceiverSocket(jobId) {
  return io({
    transports: ['websocket'],
    path: '/signal/receiver',
    query: {
      jobId
    },
    ...SOCKET_COMMON_CONFIG
  });
}
