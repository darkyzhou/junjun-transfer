import { makeStunConnection } from './stun';
import { bootstrapIce } from './bootstrap-ice';

export class ReceiverDataChannelBootstrapper {
  constructor(signalSocket) {
    this.signalSocket = signalSocket;
  }

  bootstrap() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.#doBootstrap(resolve);
      } catch (error) {
        console.debug('[receiver-data-channel-bootstrapper] error', error);
        reject(error);
      }
    });
  }

  async #doBootstrap(resolve) {
    this.connection = makeStunConnection();
    this.connection.ondatachannel = ({ channel }) => resolve(channel);
    bootstrapIce(this.connection, this.signalSocket);

    this.signalSocket.on('SIGNAL_OFFER', ({ offer }) => this.#handleOffer(offer));
  }

  async #handleOffer(offer) {
    console.assert(offer);
    console.log('[receiver-data-channel-bootstrapper] received remote offer:', offer);
    await this.connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    this.signalSocket.emit('SIGNAL_ANSWER', { answer });
  }
}
