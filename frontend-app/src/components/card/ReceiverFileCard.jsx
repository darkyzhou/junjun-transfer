import React, { useMemo } from 'react';
import { ProgressBar } from '../shared/ProgressBar';
import { CardContainer } from './CardContainer';
import { bytesPerSecondsToHumanFriendlyText } from '../../utils/size';
import { FileInfo } from '../shared/FileInfo';

export const ReceiverFileCard = ({ className, fileName, receivedSize, type, progress, speed, avgSpeed }) => {
  const speedText = useMemo(() => bytesPerSecondsToHumanFriendlyText(speed), [speed]);
  const avgSpeedText = useMemo(() => bytesPerSecondsToHumanFriendlyText(avgSpeed), [speed]);

  return (
    <CardContainer
      className={className}
      bottom={
        <ProgressBar progress={progress}>
          <div className="text-center px-0.5 py-1">
            <p className="text-xs sm:text-sm">{progress < 100 ? '接收中' : '接收完成'}</p>
            <p className="text-xs font-mono">
              {progress < 100 && speedText}
              {progress >= 100 && avgSpeedText}
            </p>
          </div>
        </ProgressBar>
      }
    >
      <FileInfo name={fileName} size={receivedSize} type={type} />
    </CardContainer>
  );
};
