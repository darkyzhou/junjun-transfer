import { PROTOCOL_ID } from '../constraints/protocol-constraints';

const DEFAULT_CHANNEL_CONFIGURATION = {
  protocol: PROTOCOL_ID,
  ordered: true
};

export function bootstrapDataChannel(connection) {
  const dataChannel = connection.createDataChannel('dataChannel', DEFAULT_CHANNEL_CONFIGURATION);
  dataChannel.binaryType = 'arraybuffer';
  return dataChannel;
}
