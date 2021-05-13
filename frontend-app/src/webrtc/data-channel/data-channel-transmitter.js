const MAX_CHUNK_SIZE = 16 * 1024;
const STATE_UPDATE_INTERVAL = 500;

export const EVENT_BUFFERED_AMOUNT_LOW = 'buffered-amount-low';
export const EVENT_TRANSMISSION_PROGRESS = 'transmission-progress';
export const EVENT_TRANSMISSION_PAUSED = 'transmission-paused';
export const EVENT_TRANSMISSION_COMPLETED = 'transmission-completed';
export const EVENT_TRANSMISSION_SPEED_UPDATE = 'transmission-speed-update';

export class DataChannelTransmitter {
  constructor(connection, dataChannel) {
    this.dataChannel = dataChannel;
    this.target = new EventTarget();
    this.chunkSize = Math.min(connection.sctp.maxMessageSize, MAX_CHUNK_SIZE);
    this.dataChannel.bufferedAmountLowThreshold = this.chunkSize;
    this.highWaterMark = this.chunkSize * 8;
    this.#reset();

    this.stateUpdateHandle = setTimeout(() => this.#doStateUpdate(), STATE_UPDATE_INTERVAL);
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  destroy() {
    clearTimeout(this.stateUpdateHandle);
    this.#reset();
  }

  send(arrayBuffer) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.#doSend(arrayBuffer, resolve);
      } catch (error) {
        reject(error);
      }
    });
  }

  async #doSend(arrayBuffer, resolve) {
    if (this.currentArrayBuffer) {
      throw new Error('[data-channel-transmitter] previous array buffer is still under transmission');
    }
    this.#reset(arrayBuffer, resolve);
    this.dataChannel.onbufferedamountlow = () => {
      this.target.dispatchEvent(
        new CustomEvent(EVENT_BUFFERED_AMOUNT_LOW, {
          detail: {
            currentBufferedAmount: this.dataChannel.bufferedAmount
          }
        })
      );
      console.debug('[data-channel-transmitter] buffered amount is low, now continue sending data');
      this.#doSendDataLoop();
    };
    this.#doSendDataLoop();
  }

  #doSendDataLoop() {
    let bufferedAmount = this.dataChannel.bufferedAmount;
    while (this.bytesTransmitted < this.totalBytes) {
      const length = Math.min(this.chunkSize, this.totalBytes - this.bytesTransmitted);
      const data = new Uint8Array(this.currentArrayBuffer, this.bytesTransmitted, length);
      this.dataChannel.send(data);

      this.bytesTransmitted += length;
      bufferedAmount += length;
      this.target.dispatchEvent(
        new CustomEvent(EVENT_TRANSMISSION_PROGRESS, {
          bytesTransmitted: this.bytesTransmitted,
          totalBytes: this.totalBytes
        })
      );

      if (bufferedAmount >= this.highWaterMark) {
        this.target.dispatchEvent(
          new CustomEvent(EVENT_TRANSMISSION_PAUSED, {
            detail: { bufferedAmount }
          })
        );
        console.debug(
          `[data-channel-transmitter] transmission paused due to channel.bufferedAmount being over ${this.highWaterMark}`
        );
        break;
      }
    }
  }

  #doStateUpdate() {
    this.#updateTransmissionSpeed();
    this.#checkCompleted();
    this.stateUpdateHandle = setTimeout(() => this.#doStateUpdate(), STATE_UPDATE_INTERVAL);
  }

  #checkCompleted() {
    if (this.currentArrayBuffer && this.dataChannel.bufferedAmount <= 0 && this.bytesTransmitted === this.totalBytes) {
      console.debug(`[data-channel-transmitter] successfully sent ${this.bytesTransmitted}bytes`);
      this.target.dispatchEvent(new CustomEvent(EVENT_TRANSMISSION_COMPLETED));
      console.assert(this.currentResolve);
      this.currentResolve();
      this.#reset();
    }
  }

  #updateTransmissionSpeed() {
    this.transmissionSpeed = (this.bytesTransmitted - this.lastBytesTransmitted) / STATE_UPDATE_INTERVAL;
    this.lastBytesTransmitted = this.bytesTransmitted;
    this.target.dispatchEvent(
      new CustomEvent(EVENT_TRANSMISSION_SPEED_UPDATE, {
        detail: {
          transmissionSpeed: this.transmissionSpeed
        }
      })
    );
  }

  #reset(arrayBuffer = null, resolve = null) {
    this.currentArrayBuffer = arrayBuffer;
    this.currentResolve = resolve;
    this.bytesTransmitted = 0;
    this.lastBytesTransmitted = 0;
    this.totalBytes = arrayBuffer?.byteLength;
    this.transmissionSpeed = 0;
  }
}
