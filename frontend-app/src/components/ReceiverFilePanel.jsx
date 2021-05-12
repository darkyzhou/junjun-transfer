import React from 'react';
import { PanelContainer } from './PanelContainer';
import { CatImage } from './CatImage';
import { FileIcon } from './FileIcon';
import { ProgressBar } from './ProgressBar';

export const ReceiverFilePanel = ({ receivedFileMeta, progress }) => {
  return (
    <PanelContainer>
      <div className="w-full h-full shadow-2xl rounded-md bg-gray-600 text-gray-300 overflow-hidden flex flex-col">
        <div className="flex-1 relative">
          <CatImage />
          <div
            className="absolute inset-0 z-10 grid place-items-center"
            style={{ background: 'radial-gradient(rgb(55 65 81 / 0%), #374151)' }}
          >
            <FileIcon />
            <div>
              <p>{receivedFileMeta?.name}</p>
            </div>
          </div>
        </div>
        <div className="flex-none text-center">
          {!receivedFileMeta && <p className="text-sm p-2">伙伴已经连接到你的浏览器，就等你选好文件开始发送了！</p>}
          {receivedFileMeta && (
            <ProgressBar progress={progress?.percentage}>
              <div className="text-sm p-2">紧张接收中</div>
            </ProgressBar>
          )}
        </div>
      </div>
    </PanelContainer>
  );
};
