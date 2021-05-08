import { bootstrapIce } from './bootstrap-ice';
import { makeStunConnection } from './stun';
import { bootstrapDataChannel } from './bootstrap-data-channel';

export class SenderDataChannelBootstrapper {
  constructor(signalSocket) {
    this.signalSocket = signalSocket;
  }

  bootstrap() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.#initDataChannel(resolve);
      } catch (error) {
        console.debug('[sender-connection-bootstrap] error bootstrapping:', error);
        reject(error);
      }
    });
  }

  async #initDataChannel(resolve) {
    this.connection = makeStunConnection();
    this.channel = bootstrapDataChannel(this.connection);
    this.channel.onopen = () => {
      console.debug('[sender-connection-bootstrap] channel established');
      resolve({ connection: this.connection, channel: this.channel });
    };
    bootstrapIce(this.connection, this.signalSocket);

    this.signalSocket.on('SIGNAL_ANSWER', async ({ answer }) => {
      console.debug('[sender-connection-bootstrap] received answer:', answer);
      await this.connection.setRemoteDescription(new RTCSessionDescription(answer));
    });
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.signalSocket.emit('SIGNAL_OFFER', { offer });
  }
}
