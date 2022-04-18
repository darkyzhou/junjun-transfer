export function copyArrayBuffer(from, to, length) {
  const fromView = new Uint8Array(from);
  const toView = new Uint8Array(to);
  for (let i = 0; i < length; i++) {
    toView[i] = fromView[i];
  }
}

export function stripZeros(byteBuffer) {
  const view = new Uint8Array(byteBuffer);
  const index = view.indexOf(0);
  return new Uint8Array(byteBuffer, 0, index);
}
