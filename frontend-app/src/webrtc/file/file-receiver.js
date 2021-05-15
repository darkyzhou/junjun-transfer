import { DataChannelReceiver } from '../data-channel/data-channel-receiver';
import { decodeMetaMessage } from './meta-message-utils';
import { META_MESSAGE_BYTES } from '../constraints/protocol-constraints';

export const EVENT_META_RECEIVED = 'meta-received';
export const EVENT_FILE_RECEIVED = 'file-received';

export class FileReceiver {
  constructor(channel) {
    this.receiver = new DataChannelReceiver(channel);
    this.target = new EventTarget();
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  async receiveSingleFile() {
    const metaBuffer = await this.receiver.receive(META_MESSAGE_BYTES);
    const meta = decodeMetaMessage(metaBuffer);
    this.target.dispatchEvent(new CustomEvent(EVENT_META_RECEIVED, { detail: { meta } }));
    console.debug('[file-receiver] got meta:', meta);

    const fileBuffer = await this.receiver.receive(meta.totalBytes);
    this.target.dispatchEvent(new CustomEvent(EVENT_FILE_RECEIVED, { detail: { fileBuffer } }));
    console.debug('[file-receiver] successfully received a file');
    return { meta, fileBuffer };
  }

  async *receiveFiles() {
    while (true) {
      yield await this.receiveSingleFile();
    }
  }
}
