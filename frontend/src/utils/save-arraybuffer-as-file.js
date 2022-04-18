export function saveArraybufferAsFile(arrayBuffer, name, type) {
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
