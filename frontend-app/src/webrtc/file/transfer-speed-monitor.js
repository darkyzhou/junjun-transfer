export const EVENT_TRANSFER_SPEED_UPDATE = 'transfer-speed-update';

const DURATION = 1000;

export class TransferSpeedMonitor {
  constructor() {
    this.last = 0;
    this.current = 0;
    this.goal = 0;
    this.cancelled = true;
    this.target = new EventTarget();
  }

  addEventListener(eventName, listener) {
    this.target.addEventListener(eventName, listener);
  }

  removeEventListener(eventName, listener) {
    this.target.removeEventListener(eventName, listener);
  }

  addToCurrent(value) {
    this.current += value;
  }

  start(goal) {
    this.last = this.current = 0;
    this.goal = goal;
    this.cancelled = false;
    setTimeout(() => this.#emitSpeed(), DURATION);
  }

  cancel() {
    this.target.dispatchEvent(
      new CustomEvent(EVENT_TRANSFER_SPEED_UPDATE, {
        detail: this.speedSnapshot()
      })
    );
    this.cancelled = true;
  }

  speedSnapshot() {
    const delta = this.current - this.last;
    return {
      current: this.current,
      goal: this.goal,
      speed: Math.round(delta / (DURATION / 1000)),
      avgSpeed: Math.round(this.current / (DURATION / 1000))
    };
  }

  #emitSpeed() {
    if (this.current === this.goal || this.cancelled) {
      return;
    }

    const snapshot = this.speedSnapshot();
    this.last = this.current;
    this.target.dispatchEvent(
      new CustomEvent(EVENT_TRANSFER_SPEED_UPDATE, {
        detail: snapshot
      })
    );

    setTimeout(() => this.#emitSpeed(), DURATION);
  }
}
