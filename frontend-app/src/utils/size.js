export function bytesCountToHumanFriendlyText(count) {
  if (count < 1024) {
    return `${count} Bytes`;
  } else if ((count /= 1024) < 1024) {
    return `${count.toFixed(2)} KiB`;
  } else if ((count /= 1024) < 1024) {
    return `${count.toFixed(2)} MiB`;
  } else {
    return `${count.toFixed(2)} GiB`;
  }
}

export function bytesPerSecondsToHumanFriendlyText(speed) {
  const text = bytesCountToHumanFriendlyText(speed);
  return `${text}/s`;
}
