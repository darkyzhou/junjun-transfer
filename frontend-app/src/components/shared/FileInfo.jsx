import React from 'react';
import { FileIcon } from './FileIcon';
import { bytesCountToHumanFriendlyText } from '../../utils/size';

export const FileInfo = ({ name, size = 0, type = '', children }) => {
  return (
    <div className="h-full flex flex-col justify-evenly items-center text-center p-2">
      <FileIcon fileType={type} />
      <div className="text-sm">
        <p className="max-h-[4rem] overflow-hidden">{name}</p>
        <p>{type}</p>
        <p>{bytesCountToHumanFriendlyText(size)}</p>
        {children}
      </div>
    </div>
  );
};
