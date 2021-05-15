import React from 'react';

export const Spinner = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={`animate-spin ${className}`}
    aria-hidden="true"
    role="img"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
  >
    <path
      d="M13 3a7 7 0 0 0 0 14a5 5 0 0 0 0-10a3 3 0 0 0 0 6a1 1 0 0 0 0-2a1 1 0 0 1 0-2a3 3 0 0 1 0 6a5 5 0 0 1 0-10a7 7 0 0 1 0 14a9 9 0 0 1-9-9a1 1 0 0 0-2 0a11 11 0 0 0 11 11a9 9 0 0 0 0-18z"
      fill="currentColor"
    ></path>
  </svg>
);
