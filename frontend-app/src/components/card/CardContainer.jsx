import React from 'react';
import styled from 'styled-components';
import colors from 'tailwindcss/colors';

const RootContainer = styled.div`
  box-shadow: 0 0 48px ${colors.coolGray['800']};
`;

const Shadow = styled.div`
  background: linear-gradient(to top, rgba(0, 0, 0, 0.36), transparent 25%);
`;

export const CardContainer = ({ children, bottom }) => {
  return (
    <RootContainer className="w-[16rem] h-[18rem] rounded-md bg-gray-800 text-gray-300 overflow-hidden flex flex-col">
      <div className="flex-1 relative">
        {children}
        <Shadow className="absolute inset-0" />
      </div>
      <div className="flex-none bg-gray-700">{bottom}</div>
    </RootContainer>
  );
};
