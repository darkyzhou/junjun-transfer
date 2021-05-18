import React from 'react';
import styled from 'styled-components';
import colors from 'tailwindcss/colors';
import defaultConfig from 'tailwindcss/defaultConfig';

const Div = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    left: 0;
    right: ${({ progress }) => 100 - progress}%;
    background: ${colors.cyan['600']};
    transition-property: right;
    transition-duration: ${defaultConfig.theme.transitionDuration.DEFAULT};
    transition-timing-function: ${defaultConfig.theme.transitionTimingFunction.DEFAULT};
  }
`;

export const ProgressBar = ({ progress = 0, children }) => {
  return (
    <Div progress={progress}>
      <div className="relative z-10">{children}</div>
    </Div>
  );
};
