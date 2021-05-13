import React from 'react';
import { PanelContainer } from './panel/PanelContainer';

export const CardContainer = ({ mask, children }) => {
  return (
    <PanelContainer>
      <div className="w-full h-full shadow-2xl rounded-md bg-gray-600 text-gray-300 overflow-hidden flex flex-col">
        <div className="flex-1">
          <div className="w-full h-full grid place-items-center">{mask}</div>
        </div>
        <div className="flex-none">{children}</div>
      </div>
    </PanelContainer>
  );
};
