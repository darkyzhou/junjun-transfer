import React from 'react';
import { CardContainer } from './CardContainer';
import { Spinner } from '../Spinner';
import { CatImage } from '../CatImage';
import styled from 'styled-components';

const Shadow = styled.div`
  background: rgba(0, 0, 0, 0.4);
`;

export const ConnectionStatusIndicatorCard = ({ spinner, cat = true, message }) => {
  return (
    <CardContainer bottom={<div className="p-2 text-center text-sm">{message}</div>}>
      <div className="w-full h-full relative overflow-hidden">
        {cat && <CatImage className="block absolute h-auto w-full max-w-none" />}
        {spinner && (
          <Shadow className="relative p-16 z-10 w-full h-full">
            <Spinner />
          </Shadow>
        )}
      </div>
    </CardContainer>
  );
};
