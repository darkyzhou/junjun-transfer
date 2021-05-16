import { TransferSpeedMonitor } from '../file/transfer-speed-monitor';

export const EVENT_CHANNEL_CLOSED = 'channel-closed';

export class DataChannelReceiver {
  constructor(channel) {
    this.target = new EventTarget();
    this.speedMonitor = new TransferSpeedMonitor();
    channel.onmessage = ({ data }) => this.#onReceiveData(data);
    channel.onclose = () => this.#onChannelClose();
    this.#reset();
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
        await this.#doReceive(bytesToReceive, resolve);
      } catch (error) {
        console.debug('[data-channel-receiver] error', error);
        reject(error);
      }
    });
  }

  async #doReceive(bytesToReceive, resolve) {
    this.#reset(bytesToReceive, resolve);
  }

  #onReceiveData(receivedBuffer) {
    if (this.speedMonitor.cancelled) {
      this.speedMonitor.start(this.totalBytes);
    }
    if (!this.currentResolve) {
      console.debug('[data-channel-receiver] ignored newly received arraybuffer');
      return;
    }
    const length = receivedBuffer.byteLength;
    const receivedBufferView = new Uint8Array(receivedBuffer);
    for (let i = 0; i < length; i++) {
      this.arrayBufferView[this.receivedBytes + i] = receivedBufferView[i];
    }
    this.receivedBytes += length;
    this.speedMonitor.addToCurrent(length);

    if (this.receivedBytes === this.totalBytes) {
      console.debug(`[data-channel-receiver] successfully received ${this.receivedBytes}bytes of data`);
      console.assert(this.currentResolve);
      this.currentResolve(this.arrayBuffer);
      this.speedMonitor.cancel();
      this.#reset();
    }
  }

  #onChannelClose() {
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

  #reset(totalBytes = 0, resolve = null) {
    this.currentResolve = resolve;
    this.totalBytes = totalBytes;
    this.arrayBuffer = new ArrayBuffer(totalBytes);
    this.arrayBufferView = new Uint8Array(this.arrayBuffer);
    this.receivedBytes = 0;
  }
}
