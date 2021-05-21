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
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: { level: 'debug', args } }));
  }

  log(...args) {
    console.log(...args);
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: { level: 'log', args } }));
  }

  error(...args) {
    console.error(...args);
    this.target.dispatchEvent(new CustomEvent(EVENT_NEW_LOG, { detail: { level: 'error', args } }));
  }
}

export const LOGGER = new Logger();
