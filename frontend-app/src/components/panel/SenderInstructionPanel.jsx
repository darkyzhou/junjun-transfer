import React from 'react';
import { PanelContainer } from './PanelContainer';

export const SenderInstructionPanel = ({ onSelectFile, className }) => {
  return (
    <PanelContainer className={`relative ${className}`}>
      <input type="file" id="file" hidden onChange={(event) => onSelectFile(event.target.files[0])} />
      <label htmlFor="file" className="opacity-0 absolute inset-0 cursor-pointer" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="text-gray-300"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"></path>
      </svg>
      <h3 className="text-gray-300 cursor-text z-10 text-sm">
        将要上传的文件用鼠标拖到这里，或者直接点击这里的加号来选择文件！
      </h3>
    </PanelContainer>
  );
};
