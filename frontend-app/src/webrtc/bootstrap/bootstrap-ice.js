import { LOGGER } from '../../utils/logger';

export function bootstrapIce(connection, socket) {
  connection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      LOGGER.debug('[bootstrap-ice] new candidate:', candidate);
      socket.emit('SIGNAL_CANDIDATE', { candidate });
    }
  };
  socket.on('SIGNAL_CANDIDATE', async ({ candidates }) => {
    LOGGER.debug('[bootstrap-ice] got remote candidates:', candidates);
    for (const candidate of candidates) {
      await connection.addIceCandidate(candidate);
    }
  });
}
