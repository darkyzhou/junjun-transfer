import React, { useEffect, useRef } from 'react';
import { PanelContainer } from './PanelContainer';
import QRCode from 'qrcode';

export const ReceiverInstructionPanel = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, 'text', {
        margin: 1,
        width: 12 * 12
      });
    }
  }, [canvasRef.current]);
  return (
    <PanelContainer>
      <p className="text-gray-300 mb-2">为了让你的小伙伴能够收到文件，请让TA扫描下方二维码：</p>
      <div className="flex justify-center mb-2">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-gray-300">
        或者让TA访问下面的链接：<a href="https://baidu.com">https://baidu.com</a>
      </p>
    </PanelContainer>
  );
};
