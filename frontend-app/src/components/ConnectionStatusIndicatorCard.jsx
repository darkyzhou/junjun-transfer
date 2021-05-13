import React from 'react';
import { CardContainer } from './CardContainer';
import { Spinner } from './Spinner';

export const ConnectionStatusIndicatorCard = ({ spinner, message }) => {
  return (
    <CardContainer
      mask={
        spinner && (
          <div className="w-full h-full p-16">
            <Spinner />
          </div>
        )
      }
    >
      <div className="p-2">
        {message}
      </div>
    </CardContainer>
  );
};
