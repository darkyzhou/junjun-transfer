import React from 'react';
import { CardContainer } from './CardContainer';
import { Spinner } from '../shared/Spinner';
import { CatImage } from '../shared/CatImage';
import styled from 'styled-components';

const Shadow = styled.div`
  background: rgba(0, 0, 0, 0.4);
`;

export const ConnectionStatusIndicatorCard = ({ className, spinner, message }) => {
  return (
    <CardContainer className={className} bottom={<div className="p-2 text-center text-sm">{message}</div>}>
      <div className="h-full flex relative">
        <CatImage className="block flex-1" />
        {spinner && (
          <Shadow className="absolute inset-0 z-20 p-6 md:p-12 lg:p-16 grid place-items-center">
            <Spinner />
          </Shadow>
        )}
      </div>
    </CardContainer>
  );
};
