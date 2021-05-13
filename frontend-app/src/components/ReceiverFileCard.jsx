import React from 'react';
import { FileIcon } from './FileIcon';
import { ProgressBar } from './ProgressBar';
import { CardContainer } from './CardContainer';

export const ReceiverFileCard = ({ fileName, progress }) => {
  return (
    <CardContainer
      mask={
        <>
          <FileIcon />
          <div>
            <p>{fileName}</p>
          </div>
        </>
      }
    >
      <ProgressBar progress={progress}>
        <div className="text-sm p-2">紧张接收中</div>
      </ProgressBar>
    </CardContainer>
  );
};
