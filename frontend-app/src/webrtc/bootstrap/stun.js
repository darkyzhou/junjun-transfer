export function makeStunConnection() {
  const configuration = { iceServers: [{ urls: 'stun:127.0.0.1:3478' }] };
  return new RTCPeerConnection(configuration);
}
