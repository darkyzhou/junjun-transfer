import React, { useMemo } from 'react';
import { PanelContainer } from './PanelContainer';
import { Button } from './Button';
import { FileIcon } from './FileIcon';

export const SenderFilePanel = ({ file, sending, onConfirm, onCancel }) => {
  const fileSizeText = useMemo(() => {
    let { size } = file;
    if (size < 1024) {
      return `${size} Bytes`;
    } else if ((size /= 1024) < 1024) {
      return `${size.toFixed(2)} KiB`;
    } else if ((size /= 1024) < 1024) {
      return `${size.toFixed(2)} MiB`;
    } else {
      return `${size.toFixed(2)} GiB`;
    }
  }, [file.size]);

  const warning = useMemo(() => {
    if (!fileSizeText.endsWith('GiB')) {
      return null;
    }
    return '文件过大，传输可能不稳定。';
  }, [fileSizeText]);

  return (
    <PanelContainer>
      <div className="w-full h-full rounded-md p-2 text-center text-gray-300 flex flex-col justify-between">
        <div className="flex-1 flex flex-col items-center justify-evenly">
          <FileIcon />
          <div>
            <p>{file.name}</p>
            <p>{fileSizeText}</p>
          </div>
        </div>
        {warning && (
          <p className="text-sm mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="h-4 inline mr-1"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 26 26"
            >
              <path d="M1 21h22L12 2L1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"></path>
            </svg>
            <span>{warning}</span>
          </p>
        )}
        <div className="flex-none flex justify-center">
          <Button className="mr-4" onClick={onCancel} disabled={sending}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 -1 25 25"
            >
              <path
                d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-3 12.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12"
                fill="currentColor"
              ></path>
            </svg>
            返回
          </Button>
          <Button onClick={onConfirm} disabled={sending}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path d="M2 21l21-9L2 3v7l15 2l-15 2v7z" fill="currentColor"></path>
            </svg>
            发送
          </Button>
        </div>
      </div>
    </PanelContainer>
  );
};
