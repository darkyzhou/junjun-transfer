import { LOGGER } from '../../utils/logger';

const MAX_CHUNK_SIZE = 16 * 1024;
const STATE_UPDATE_INTERVAL = 500;

export class DataChannelTransmitter {
  constructor(connection, dataChannel) {
    this.dataChannel = dataChannel;
    this.chunkSize = Math.min(connection.sctp.maxMessageSize, MAX_CHUNK_SIZE);
    this.dataChannel.bufferedAmountLowThreshold = this.chunkSize;
    this.highWaterMark = this.chunkSize * 8;
    this.#reset();

    this.stateUpdateHandle = setTimeout(() => this.#doStateUpdate(), STATE_UPDATE_INTERVAL);
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
    this.dataChannel.onbufferedamountlow = () => this.#doSendDataLoop();
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

      if (bufferedAmount >= this.highWaterMark) {
        break;
      }
    }
  }

  #doStateUpdate() {
    this.#checkCompleted();
    this.stateUpdateHandle = setTimeout(() => this.#doStateUpdate(), STATE_UPDATE_INTERVAL);
  }

  #checkCompleted() {
    if (this.currentArrayBuffer && this.dataChannel.bufferedAmount <= 0 && this.bytesTransmitted === this.totalBytes) {
      LOGGER.debug(`[data-channel-transmitter] successfully sent ${this.bytesTransmitted}bytes`);
      console.assert(this.currentResolve);
      this.currentResolve();
      this.#reset();
    }
  }

  #reset(arrayBuffer = null, resolve = null) {
    this.currentArrayBuffer = arrayBuffer;
    this.currentResolve = resolve;
    this.bytesTransmitted = 0;
    this.totalBytes = arrayBuffer?.byteLength;
  }
}
