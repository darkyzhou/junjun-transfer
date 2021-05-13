import { makeStunConnection } from './stun';
import { bootstrapIce } from './bootstrap-ice';

const EVENT_ANSWER_SENT = 'answer-sent';
const EVENT_CHANNEL_OPEN = 'channel-open';

export class ReceiverDataChannelBootstrapper {
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
      await this.#doBootstrap();
    } catch (error) {
      console.debug('[receiver-data-channel-bootstrapper] error', error);
    }
  }

  async #doBootstrap() {
    this.connection = makeStunConnection();
    this.connection.ondatachannel = ({ channel }) =>
      this.target.dispatchEvent(
        new CustomEvent(EVENT_CHANNEL_OPEN, {
          detail: {
            channel
          }
        })
      );
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
    this.target.dispatchEvent(new CustomEvent(EVENT_ANSWER_SENT));
  }
}
