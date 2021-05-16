import React, { useEffect, useState } from 'react';
import { PanelContainer } from './PanelContainer';
import QRCode from 'qrcode';

export const ReceiverInstructionPanel = ({ url }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  useEffect(async () => {
    const imageUrl = await QRCode.toDataURL(url, { type: 'image/jpeg', quality: 0.3, margin: 1, width: 12 * 12 });
    setQrCodeUrl(imageUrl);
  }, [url]);
  return (
    <PanelContainer className="text-sm">
      <p className="text-gray-300 mb-2">为了让你的小伙伴能够收到文件，请让TA扫描下方二维码：</p>
      <div className="flex justify-center mb-2">
        <img src={qrCodeUrl} />
      </div>
      <p className="text-gray-300">或者让TA访问下面的链接：{url}</p>
    </PanelContainer>
  );
};
