export function makeStunConnection(serversInfo) {
  const { servers = [] } = serversInfo;
  return new RTCPeerConnection({
    iceServers: servers.map((s) => {
      if (s.type === 'stun') {
        return { urls: s.url };
      } else {
        return {
          urls: s.url,
          username: s.username,
          credential: s.credential
        };
      }
    })
  });
}
