import { DataChannelTransmitter } from '../data-channel/data-channel-transmitter';
import { encodeMetaMessage } from './meta-message-utils';

export class FileSender {
  constructor(connection, channel) {
    this.transmitter = new DataChannelTransmitter(connection, channel);
  }

  async send(file) {
    const dataBuffer = await file.arrayBuffer();

    const meta = {
      totalBytes: dataBuffer.byteLength,
      fileName: file.name,
      fileType: file.type
    };
    console.debug('[file-sender] sending meta', meta);
    await this.transmitter.send(encodeMetaMessage(meta));

    console.debug('[file-sender] sending file');
    await this.transmitter.send(dataBuffer);
  }
}
