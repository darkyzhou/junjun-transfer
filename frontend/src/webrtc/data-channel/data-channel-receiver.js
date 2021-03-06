import { LOGGER } from '../../utils/logger';

export const EVENT_PROGRESS = 'progress';
export const EVENT_RECEIVE_COMPLETED = 'receive-completed';
export const EVENT_CHANNEL_CLOSED = 'channel-closed';

export class DataChannelReceiver {
  constructor(channel) {
    this.target = new EventTarget();
    channel.onmessage = ({ data }) => this.onReceiveData(data);
    channel.onclose = () => this.onChannelClose();
    this.reset();
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  receive(bytesToReceive) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.doReceive(bytesToReceive, resolve);
      } catch (error) {
        LOGGER.error('[data-channel-receiver] error', error);
        reject(error);
      }
    });
  }

  async doReceive(bytesToReceive, resolve) {
    this.reset(bytesToReceive, resolve);
  }

  onReceiveData(receivedBuffer) {
    if (!this.currentResolve) {
      LOGGER.error('[data-channel-receiver] ignored newly received arraybuffer');
      return;
    }
    const length = receivedBuffer.byteLength;
    const receivedBufferView = new Uint8Array(receivedBuffer);
    for (let i = 0; i < length; i++) {
      this.arrayBufferView[this.receivedBytes + i] = receivedBufferView[i];
    }
    this.receivedBytes += length;
    this.target.dispatchEvent(
      new CustomEvent(EVENT_PROGRESS, {
        detail: {
          newlyReceivedBytes: length
        }
      })
    );

    if (this.receivedBytes === this.totalBytes) {
      LOGGER.debug(`[data-channel-receiver] successfully received ${this.receivedBytes}bytes of data`);
      console.assert(this.currentResolve);
      this.target.dispatchEvent(new CustomEvent(EVENT_RECEIVE_COMPLETED));
      this.currentResolve(this.arrayBuffer);
      this.reset();
    }
  }

  onChannelClose() {
    if (this.receivedBytes < this.totalBytes) {
      this.target.dispatchEvent(
        new CustomEvent(EVENT_CHANNEL_CLOSED, {
          detail: {
            receivedBytes: this.receivedBytes,
            totalBytes: this.totalBytes
          }
        })
      );
    }
  }

  reset(totalBytes = 0, resolve = null) {
    this.currentResolve = resolve;
    this.totalBytes = totalBytes;
    this.arrayBuffer = new ArrayBuffer(totalBytes);
    this.arrayBufferView = new Uint8Array(this.arrayBuffer);
    this.receivedBytes = 0;
  }
}
