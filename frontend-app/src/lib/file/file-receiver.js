import { DataChannelReceiver } from '../data-channel/data-channel-receiver';
import { decodeMetaMessage } from './meta-message-utils';
import { downloadArrayBufferAsFile } from '../utils';
import { META_MESSAGE_BYTES } from '../constraints/protocol-constraints';

export class FileReceiver {
  constructor(channel) {
    this.channelReceiver = new DataChannelReceiver(channel);
  }

  async receiveSingleFile() {
    const metaBuffer = await this.channelReceiver.receive(META_MESSAGE_BYTES);
    const meta = decodeMetaMessage(metaBuffer);
    console.debug('[file-receiver] got meta:', meta);

    const fileBuffer = await this.channelReceiver.receive(meta.totalBytes);
    console.debug('[file-receiver] successfully received a file');
    return { meta, fileBuffer };
  }

  async *receiveFiles() {
    // TODO: stop on closed
    while (true) {
      yield await this.receiveSingleFile();
    }
  }
}
