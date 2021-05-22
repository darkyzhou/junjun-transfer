import { DataChannelTransmitter } from '../data-channel/data-channel-transmitter';
import { encodeMetaMessage } from './meta-message-utils';
import { LOGGER } from '../../utils/logger';

export class FileSender {
  constructor(connection, channel) {
    this.transmitter = new DataChannelTransmitter(connection, channel);
  }

  async send(file) {
    const dataBuffer = await file.arrayBuffer();

    const meta = {
      size: dataBuffer.byteLength,
      name: file.name,
      type: file.type
    };
    LOGGER.info('[file-sender] sending meta', meta);
    await this.transmitter.send(encodeMetaMessage(meta));

    LOGGER.info('[file-sender] sending file');
    await this.transmitter.send(dataBuffer);
  }
}
