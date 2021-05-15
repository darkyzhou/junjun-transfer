import React from 'react';

export const PanelContainer = ({ className, children }) => (
  <div className="w-[16rem] h-[20rem]">
    <div
      className={`w-full h-full text-center border-dashed border-4 rounded-md border-gray-500 bg-gray-800 p-2 flex flex-col justify-around ${className}`}
    >
      {children}
    </div>
  </div>
);
