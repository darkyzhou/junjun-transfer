import React from 'react';
import { PanelContainer } from './PanelContainer';

export const SenderFilePanel = () => {
  return (
    <PanelContainer>
      <div className="w-full h-full relative text-center border-dashed border-4 rounded-md border-gray-500 p-2 hover:border-gray-400 cursor-pointer flex flex-col justify-around"></div>
    </PanelContainer>
  );
};
