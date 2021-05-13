import React from 'react';

export const PanelContainer = ({ children }) => (
  <div className="w-[16rem] h-[20rem]">
    <div className="w-full h-full text-center border-dashed border-4 rounded-md border-gray-500 p-2 flex flex-col justify-around">
      {children}
    </div>
  </div>
);
