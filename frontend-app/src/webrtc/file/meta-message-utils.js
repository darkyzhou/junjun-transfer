import { META_MESSAGE_BYTES } from '../constraints/protocol-constraints';
import { copyArrayBuffer, stripZeros } from '../utils';

export function encodeMetaMessage(meta) {
  const metaBuffer = new ArrayBuffer(META_MESSAGE_BYTES);
  new Uint8Array(metaBuffer).fill(0);

  const metaJson = JSON.stringify(meta);
  const metaBufferRaw = new TextEncoder().encode(metaJson);
  console.assert(metaBufferRaw.byteLength < META_MESSAGE_BYTES);

  copyArrayBuffer(metaBufferRaw, metaBuffer, metaBufferRaw.byteLength);
  return metaBuffer;
}

export function decodeMetaMessage(arrayBuffer) {
  const decoder = new TextDecoder();
  const data = stripZeros(arrayBuffer);
  return JSON.parse(decoder.decode(data));
}
