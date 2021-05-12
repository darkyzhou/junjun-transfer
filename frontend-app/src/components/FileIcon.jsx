import React, { useMemo } from 'react';

const DEFAULT_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="w-36 h-36"
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
  >
    <path
      d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z"
      fill="currentColor"
    ></path>
  </svg>
);

const FILE_TYPE_ICONS = {
  'plain/text': DEFAULT_ICON
};

export const FileIcon = ({ fileType }) => {
  const icon = useMemo(() => {
    if (fileType && FILE_TYPE_ICONS[fileType]) {
      return FILE_TYPE_ICONS[fileType];
    } else {
      return DEFAULT_ICON;
    }
  }, [fileType]);
  return icon;
};
