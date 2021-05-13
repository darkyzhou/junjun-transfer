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

export function downloadArrayBufferAsFile(arrayBuffer, name, type) {
  const element = document.createElement('a');
  element.style.display = 'none';
  const url = URL.createObjectURL(new Blob([arrayBuffer], { type }));
  element.href = url;
  element.download = name;
  element.type = type;
  document.body.append(element);
  element.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(element);
}
