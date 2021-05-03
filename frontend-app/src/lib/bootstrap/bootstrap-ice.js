export function bootstrapIce(token, connection, socket, isSender) {
  connection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      console.debug('[bootstrap-ice] new candidate:', candidate);
      socket.emit(`${isSender ? 'SENDER' : 'RECEIVER'}_SUBMIT_ICE_CANDIDATE`, { token, candidate });
    }
  };
  connection.onicecandidateerror = (event) => {
    console.error('[bootstrap-ice] candidate error:', event);
  };
  socket.on('NEW_ICE_CANDIDATE', async ({ candidates }) => {
    console.log('[bootstrap-ice] got remote candidates:', candidates);
    for (const candidate of candidates) {
      await connection.addIceCandidate(candidate);
    }
  });
}
