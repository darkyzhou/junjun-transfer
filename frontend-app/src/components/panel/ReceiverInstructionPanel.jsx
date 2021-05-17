import React, { useEffect, useState } from 'react';
import { PanelContainer } from './PanelContainer';
import QRCode from 'qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { Button } from '../Button';

export const ReceiverInstructionPanel = ({ url, className }) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  useEffect(async () => {
    const imageUrl = await QRCode.toDataURL(url, { type: 'image/jpeg', quality: 0.3, margin: 1 });
    setQrCodeUrl(imageUrl);
  }, [url]);
  return (
    <PanelContainer className={`text-sm text-gray-300 ${className}`}>
      <p className="mb-2">为了让你的小伙伴能够收到文件，请让TA扫描下方二维码：</p>
      <div className="flex justify-center mb-2">
        <img src={qrCodeUrl} className="max-w-full max-h-full" />
      </div>
      <p>或者让TA用浏览器打开下面的链接：</p>
      <div className="flex rounded border-solid border-2 border-gray-500">
        <input type="text" className="bg-gray-800 flex-1 px-2 py-1 w-0" disabled={true} value={url} />
        <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
          <Button className="flex-none px-2 py-1">{copied ? 'OK' : '复制'}</Button>
        </CopyToClipboard>
      </div>
    </PanelContainer>
  );
};
