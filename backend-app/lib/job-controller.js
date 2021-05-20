const Job = require('./job');

const JOB_ID_PATTERN = /^[A-Za-z0-9_-]{12}$/;

class JobController {
  constructor(senderWs, receiverWs) {
    this.senderWs = senderWs;
    this.receivedWs = receiverWs;
    this.jobMap = new Map();
  }

  init() {
    this.senderWs.on('connection', (socket) =>
      this.#handleError(socket, () => {
        const { jobId } = socket.handshake.query;
        this.#checkJobId(jobId);
        if (this.jobMap.has(jobId)) {
          throw new Error('传输码对应的传输已经在进行');
        }

        const job = new Job(jobId, () => this.#onJobDestroy(jobId));
        job.setSenderSocket(socket);
        this.jobMap.set(jobId, job);
      })
    );
    this.receivedWs.on('connection', (socket) =>
      this.#handleError(socket, () => {
        const { jobId } = socket.handshake.query;
        this.#checkJobId(jobId);
        if (!this.jobMap.has(jobId)) {
          throw new Error('传输码对应的传输不存在');
        }

        const job = this.jobMap.get(jobId);
        job.setReceiverSocket(socket);
      })
    );
  }

  #handleError(socket, action) {
    try {
      action();
    } catch (error) {
      socket.emit('ERROR', { message: error.message });
      socket.disconnect(true);
    }
  }

  #checkJobId(jobId) {
    if (!jobId) {
      throw new Error('未指定传输码');
    }
    if (!JOB_ID_PATTERN.test(jobId)) {
      throw new Error('给定的传输码格式有误');
    }
  }

  #onJobDestroy(jobId) {
    this.jobMap.delete(jobId);
  }
}

module.exports = { JobController };
