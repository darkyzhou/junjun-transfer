import React from 'react';

export const Button = ({ disabled = false, children, ...props }) => {
  return (
    <div {...props}>
      <button
        disabled={disabled}
        className={`border-2 rounded-md px-4 py-1 transition-colors !outline-none
        ${
          disabled
            ? 'cursor-not-allowed text-gray-500 border-gray-500'
            : 'border-gray-400 text-gray-300 hover:border-gray-300 hover:bg-gray-300 hover:text-gray-800'
        }`}
      >
        {children}
      </button>
    </div>
  );
};
