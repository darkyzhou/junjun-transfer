module.exports = class {
  #socketMap = new Map();

  #checkItem(token) {
    if (!this.#socketMap.has(token)) {
      this.#socketMap.set(token, { senderCandidates: [], receiverCandidates: [] });
    }
  }

  #updateItem(token, modifier) {
    const item = this.#socketMap.get(token);
    this.#socketMap.set(token, modifier(item));
  }

  setSenderSocket(token, socket) {
    this.#checkItem(token);
    this.#updateItem(token, (item) => ({ ...item, senderSocket: socket }));
  }

  setReceiverSocket(token, socket) {
    this.#checkItem(token);
    this.#updateItem(token, (item) => ({ ...item, receiverSocket: socket }));
  }

  setSenderOffer(token, offer) {
    this.#checkItem(token);
    this.#updateItem(token, (item) => ({ ...item, senderOffer: offer }));
  }

  appendSenderCandidate(token, candidate) {
    this.#checkItem(token);
    this.#updateItem(token, (item) => ({
      ...item,
      senderCandidates: [
        ...item.senderCandidates,
        {
          data: candidate,
          consumed: false
        }
      ]
    }));
  }

  appendReceiverCandidate(token, candidate) {
    this.#checkItem(token);
    this.#updateItem(token, (item) => ({
      ...item,
      receiverCandidates: [
        ...item.receiverCandidates,
        {
          data: candidate,
          consumed: false
        }
      ]
    }));
  }

  get(token) {
    return this.#socketMap.get(token);
  }

  hasSender(token) {
    return !!this.#socketMap.get(token)?.senderSocket;
  }

  hasReceiver(token) {
    return !!this.#socketMap.get(token)?.receiverSocket;
  }

  dropSocket(socket) {
    for (const [token, value] of this.#socketMap.entries()) {
      let updated = false;
      if (value.senderSocket === socket) {
        this.#updateItem(token, (item) => ({ ...item, senderSocket: undefined }));
        updated = true;
      }
      if (value.receiverSocket === socket) {
        this.#updateItem(token, (item) => ({ ...item, receiverSocket: undefined }));
        updated = true;
      }
      if (updated) {
        const { senderSocket, receiverSocket } = this.#socketMap.get(token);
        if (!senderSocket && !receiverSocket) {
          console.log(`[signal] dropping socket pair whose token is '${token}'`);
          this.#socketMap.delete(token);
        }
        break;
      }
    }
  }

  getSenderOffer(token) {
    return this.#socketMap.get(token)?.senderOffer;
  }

  getSenderCandidates(token) {
    const original = this.#socketMap.get(token);
    console.assert(original);
    const unconsumed = original.senderCandidates
      .filter((item) => !item.consumed)
      .map((item) => item.data);
    this.#socketMap.set(token, {
      ...original,
      senderCandidates: original.senderCandidates.map((item) => ({ ...item, consumed: true }))
    });
    return unconsumed;
  }

  getReceiverCandidates(token) {
    const original = this.#socketMap.get(token);
    console.assert(original);
    const unconsumed = original.receiverCandidates
      .filter((item) => !item.consumed)
      .map((item) => item.data);
    this.#socketMap.set(token, {
      ...original,
      receiverCandidates: original.receiverCandidates.map((item) => ({ ...item, consumed: true }))
    });
    return unconsumed;
  }
};
