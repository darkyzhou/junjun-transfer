import { makeStunConnection } from './stun';
import { bootstrapIce } from './bootstrap-ice';

export class ReceiverDataChannelBootstrapper {
  constructor(signalSocket, token) {
    this.signalSocket = signalSocket;
    this.token = token;
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
    bootstrapIce(this.token, this.connection, this.signalSocket, false);

    this.signalSocket.on('RECEIVER_GET_OFFER_RESPONSE', ({ offer }) => this.#handleOffer(offer));
    this.signalSocket.emit('RECEIVER_GET_OFFER', { token: this.token });
  }

  async #handleOffer(offer) {
    console.assert(offer);
    console.log('[receiver-data-channel-bootstrapper] received remote offer:', offer);
    await this.connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);
    this.signalSocket.emit('RECEIVER_SUBMIT_ANSWER', { token: this.token, answer });
  }
}
