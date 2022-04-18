import React, { useMemo } from 'react';
import { Button } from '../shared/Button';
import { CardContainer } from './CardContainer';
import { FileInfo } from '../shared/FileInfo';
import { bytesCountToHumanFriendlyText } from '../../utils/size';

export const SenderSelectedFileCard = ({ file, canSend, sending, onConfirm, onCancel, className }) => {
  const warning = useMemo(() => {
    const text = bytesCountToHumanFriendlyText(file.size);
    if (!text.endsWith('GiB')) {
      return null;
    }
    return '文件过大，传输可能不稳定';
  }, [file.size]);

  return (
    <CardContainer
      className={className}
      bottom={
        <div className="w-full flex">
          <Button className="flex-1 rounded-bl-md" onClick={onCancel} disabled={sending}>
            <span className="inline-flex self-center pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="relative top-[0.125em]"
                width="1em"
                height="1em"
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
            </span>
            返回
          </Button>
          <Button primary={true} className="flex-1 rounded-br-md" onClick={onConfirm} disabled={sending || !canSend}>
            <span className="inline-flex self-center pr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="relative top-[0.125em]"
                width="1em"
                height="1em"
                aria-hidden="true"
                role="img"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path d="M2 21l21-9L2 3v7l15 2l-15 2v7z" fill="currentColor"></path>
              </svg>
            </span>
            发送
          </Button>
        </div>
      }
    >
      <FileInfo name={file.name} size={file.size} type={file.type}>
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
      </FileInfo>
    </CardContainer>
  );
};
