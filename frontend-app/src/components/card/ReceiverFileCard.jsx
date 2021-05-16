import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { CardContainer } from './CardContainer';
import { bytesPerSecondsToHumanFriendlyText } from '../../utils/size';
import { FileInfo } from '../shared/FileInfo';

export const ReceiverFileCard = ({ fileName, receivedSize, type, progress, speed }) => {
  return (
    <CardContainer
      bottom={
        <ProgressBar progress={progress}>
          <div className="text-center text-sm p-2">
            {progress < 100 && `紧张接收中：${bytesPerSecondsToHumanFriendlyText(speed)}`}
            {progress >= 100 && '接收完成'}
          </div>
        </ProgressBar>
      }
    >
      <FileInfo name={fileName} size={receivedSize} type={type} />
    </CardContainer>
  );
};
