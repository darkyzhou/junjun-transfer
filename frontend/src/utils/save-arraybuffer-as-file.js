import { isIosChrome } from './utils';

export function saveArraybufferAsFile(arrayBuffer, name, type) {
  const url = URL.createObjectURL(new Blob([arrayBuffer], { type }));

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name;
  a.type = type;
  if (isIosChrome()) {
    a.target = '_blank';
  }
  document.body.append(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 200);
}
