import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  scroll-snap-type: y mandatory;
`;

export const IceServersPanel = ({ iceServersInfo = [] }) => {
  return (
    <div className="absolute inset-0">
      <Container className="mx-auto w-max h-full flex flex-col items-center overflow-auto overscroll-auto">
        {iceServersInfo.map(({ id, url, displayName, description }) => (
          <div key={id} className="px-4 py-2 flex-col my-2 bg-gray-800 rounded w-full max-w-[32rem] shadow">
            <div className="flex-1 flex justify-between items-baseline mb-1">
              <p className="mr-4 font-bold">{displayName}</p>
              <p className="font-mono italic text-gray-500 text-xs max-w-[12rem] truncate">{url}</p>
            </div>
            <div className="flex-1 text-sm max-h-[2.5rem] overflow-auto break-all text-gray-400">{description}</div>
          </div>
        ))}
      </Container>
    </div>
  );
};
