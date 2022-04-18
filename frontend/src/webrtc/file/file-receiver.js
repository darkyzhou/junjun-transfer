import { DataChannelReceiver, EVENT_PROGRESS, EVENT_RECEIVE_COMPLETED } from '../data-channel/data-channel-receiver';
import { decodeMetaMessage } from './meta-message-utils';
import { META_MESSAGE_BYTES } from '../constraints/protocol-constraints';
import { TransferSpeedMonitor } from './transfer-speed-monitor';
import { LOGGER } from "../../utils/logger";

export const EVENT_META_RECEIVED = 'meta-received';
export const EVENT_FILE_RECEIVED = 'file-received';

export class FileReceiver {
  constructor(channel) {
    this.receiver = new DataChannelReceiver(channel);
    this.target = new EventTarget();
    this.speedMonitor = new TransferSpeedMonitor();
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
    LOGGER.info('[file-receiver] got meta:', meta);

    const onReceiverProgress = ({ detail: { newlyReceivedBytes } }) =>
      this.speedMonitor.addToCurrent(newlyReceivedBytes);
    const onReceiverCompleted = () => this.speedMonitor.cancel();

    this.receiver.addEventListener(EVENT_PROGRESS, onReceiverProgress);
    this.receiver.addEventListener(EVENT_RECEIVE_COMPLETED, onReceiverCompleted);

    console.assert(this.speedMonitor.cancelled);
    this.speedMonitor.start(meta.size);
    const fileBuffer = await this.receiver.receive(meta.size);
    this.target.dispatchEvent(new CustomEvent(EVENT_FILE_RECEIVED));
    LOGGER.info('[file-receiver] successfully received a file');

    this.receiver.removeEventListener(EVENT_PROGRESS, onReceiverProgress);
    this.receiver.removeEventListener(EVENT_RECEIVE_COMPLETED, onReceiverCompleted);

    return { meta, fileBuffer };
  }

  async *receiveFiles() {
    while (true) {
      yield await this.receiveSingleFile();
    }
  }
}
