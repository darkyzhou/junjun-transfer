import React, { useMemo } from 'react';

function makeIcon(content) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="w-28 h-28 sm:w-36 sm:h-36"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
    >
      {content}
    </svg>
  );
}

const DEFAULT_ICON = makeIcon(
  <path
    d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z"
    fill="currentColor"
  />
);
const IMAGE_ICON = makeIcon(
  <path
    d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m0 18h12v-8l-4 4l-2-2l-6 6M8 9a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2z"
    fill="currentColor"
  />
);
const VIDEO_ICON = makeIcon(
  <path
    d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m11 17v-6l-3 2.2V13H7v6h7v-2.2l3 2.2z"
    fill="currentColor"
  />
);
const PDF_ICON = makeIcon(
  <path
    d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m4.1 9.4c-.02.04-.29 1.76-2.1 4.69c0 0-3.5 1.82-2.67 3.18c.67 1.08 2.32-.04 3.74-2.68c0 0 1.82-.64 4.24-.82c0 0 3.86 1.73 4.39-.11c.52-1.86-3.06-1.44-3.7-1.25c0 0-2-1.35-2.5-3.21c0 0 1.14-3.95-.61-3.9c-1.75.05-1.09 3.13-.79 4.1m.81 1.04c.03.01.47 1.21 1.89 2.46c0 0-2.33.46-3.39.9c0 0 1-1.73 1.5-3.36m3.93 2.72c.58-.16 2.33.15 2.26.48c-.06.33-2.26-.48-2.26-.48M7.77 17c-.53 1.24-1.44 2-1.67 2c-.23 0 .7-1.6 1.67-2m3.14-6.93c0-.07-.36-2.2 0-2.15c.54.08 0 2.08 0 2.15z"
    fill="currentColor"
  />
);
const ZIP_ICON = makeIcon(
  <path
    d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z"
    fill="currentColor"
  />
);

const FILE_TYPE_ICONS = {
  'image/': IMAGE_ICON,
  'video/': VIDEO_ICON,
  'application/pdf': PDF_ICON,
  'application/zip': ZIP_ICON
};

export const FileIcon = ({ fileType }) => {
  const icon = useMemo(() => {
    if (!fileType) {
      return DEFAULT_ICON;
    }
    const types = Object.keys(FILE_TYPE_ICONS);
    const target = types.find((t) => fileType.startsWith(t));
    if (!target) {
      return DEFAULT_ICON;
    }
    return FILE_TYPE_ICONS[target];
  }, [fileType]);
  return icon;
};
