import { customAlphabet } from 'nanoid';
import { io } from 'socket.io-client';

const nanoid = customAlphabet('1234567890abcdef', 5);

export function makeJobId() {
  return nanoid();
}

const SOCKET_COMMON_CONFIG = {
  closeOnBeforeunload: false,
  autoConnect: false
};

export function makeSenderSocket(jobId) {
  return io(process.env.SERVER_URL || location.origin, {
    transports: ['websocket'],
    path: '/signal/sender',
    query: {
      jobId
    },
    ...SOCKET_COMMON_CONFIG
  });
}

export function makeReceiverSocket(jobId) {
  return io(process.env.SERVER_URL || location.origin, {
    transports: ['websocket'],
    path: '/signal/receiver',
    query: {
      jobId
    },
    ...SOCKET_COMMON_CONFIG
  });
}
