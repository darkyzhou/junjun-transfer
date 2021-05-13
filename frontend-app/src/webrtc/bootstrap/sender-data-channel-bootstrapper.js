import { bootstrapIce } from './bootstrap-ice';
import { makeStunConnection } from './stun';
import { bootstrapDataChannel } from './bootstrap-data-channel';

export const EVENT_ANSWER_RECEIVED = 'answer-received';
export const EVENT_CHANNEL_OPEN = 'channel-open';

export class SenderDataChannelBootstrapper {
  constructor(signalSocket) {
    this.signalSocket = signalSocket;
    this.target = new EventTarget();
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  async bootstrap() {
    try {
      await this.#initDataChannel();
    } catch (error) {
      console.debug('[sender-connection-bootstrap] error bootstrapping:', error);
    }
  }

  async #initDataChannel() {
    this.connection = makeStunConnection();
    this.channel = bootstrapDataChannel(this.connection);
    this.channel.onopen = () => {
      console.debug('[sender-connection-bootstrap] channel established');
      this.target.dispatchEvent(
        new CustomEvent(EVENT_CHANNEL_OPEN, {
          detail: { connection: this.connection, channel: this.channel }
        })
      );
    };
    bootstrapIce(this.connection, this.signalSocket);

    this.signalSocket.on('SIGNAL_ANSWER', async ({ answer }) => {
      console.debug('[sender-connection-bootstrap] received answer:', answer);
      this.target.dispatchEvent(new CustomEvent(EVENT_ANSWER_RECEIVED));
      await this.connection.setRemoteDescription(new RTCSessionDescription(answer));
    });
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.signalSocket.emit('SIGNAL_OFFER', { offer });
  }
}
