import React from 'react';

export const Button = ({ primary = false, children, ...props }) => {
  return (
    <button
      {...props}
      className={`text-sm p-2 transition-colors !outline-none ${props.className}
        ${
          props.disabled
            ? 'cursor-not-allowed text-gray-500 border-gray-500'
            : `border-gray-400 text-gray-300 ${primary ? 'hover:bg-cyan-600' : 'hover:bg-gray-300 hover:text-gray-800'}`
        }`}
    >
      {children}
    </button>
  );
};
