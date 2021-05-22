import React from 'react';
import { CardContainer } from './CardContainer';
import { CatImage } from '../shared/CatImage';

export const ConnectionStatusIndicatorCard = ({ className, message }) => {
  return (
    <CardContainer className={className} bottom={<div className="p-2 text-center text-sm">{message}</div>}>
      <div className="h-full flex relative">
        <CatImage className="block flex-1" />
      </div>
    </CardContainer>
  );
};
