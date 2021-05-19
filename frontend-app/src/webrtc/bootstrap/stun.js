export function makeStunConnection(serversInfo) {
  const { servers = [] } = serversInfo;
  return new RTCPeerConnection({ iceServers: servers.map((s) => ({ urls: s.url })) });
}
