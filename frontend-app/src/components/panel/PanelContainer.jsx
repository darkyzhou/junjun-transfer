import React from 'react';

export const PanelContainer = ({ className, children }) => (
  <div
    className={`sm:w-[16rem] sm:h-[18rem] text-center border-dashed border-4 rounded-md border-gray-500 bg-gray-800 p-2 flex flex-col justify-around ${className}`}
  >
    {children}
  </div>
);
