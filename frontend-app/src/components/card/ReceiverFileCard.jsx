import React from 'react';
import { ProgressBar } from '../shared/ProgressBar';
import { CardContainer } from './CardContainer';
import { bytesPerSecondsToHumanFriendlyText } from '../../utils/size';
import { FileInfo } from '../shared/FileInfo';

export const ReceiverFileCard = ({ className, fileName, receivedSize, type, progress, speed }) => {
  return (
    <CardContainer
      className={className}
      bottom={
        <ProgressBar progress={progress}>
          <div className="text-center text-xs sm:text-sm p-2">
            {progress < 100 && `接收中：${bytesPerSecondsToHumanFriendlyText(speed)}`}
            {progress >= 100 && '接收完成'}
          </div>
        </ProgressBar>
      }
    >
      <FileInfo name={fileName} size={receivedSize} type={type} />
    </CardContainer>
  );
};
