export function bootstrapIce(connection, socket) {
  connection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      console.debug('[bootstrap-ice] new candidate:', candidate);
      socket.emit('SIGNAL_CANDIDATE', { candidate });
    }
  };
  connection.onicecandidateerror = (event) => {
    console.error('[bootstrap-ice] candidate error:', event);
  };
  socket.on('SIGNAL_CANDIDATE', async ({ candidates }) => {
    console.log('[bootstrap-ice] got remote candidates:', candidates);
    for (const candidate of candidates) {
      await connection.addIceCandidate(candidate);
    }
  });
}