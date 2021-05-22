export const EVENT_NEW_LOG = 'new-log';

class Logger {
  constructor() {
    this.target = new EventTarget();
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  debug(...args) {
    console.debug(...args);
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: this.#handleMessage('debug', args) }));
  }

  info(...args) {
    console.info(...args);
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: this.#handleMessage('info', args) }));
  }

  error(...args) {
    console.error(...args);
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: this.#handleMessage('error', args) }));
  }

  #handleMessage(level, messages) {
    const serialized = messages.map((m) => (typeof m === 'object' ? JSON.stringify(m) : m));
    return {
      level,
      line: serialized.join(' ')
    };
  }
}

export const LOGGER = new Logger();
