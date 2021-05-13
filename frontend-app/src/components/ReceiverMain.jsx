import React, { useState } from 'react';
import { Status } from './Status';
import { ConnectionStatusIndicatorCard } from './ReceiverConnectionCard';
import { ReceiverFileCard } from './ReceiverFileCard';
import { CardContainer } from './CardContainer';
import { FileIcon } from './FileIcon';
import { PanelContainer } from './panel/PanelContainer';

export const ReceiverMain = ({ socket }) => {
  const [transferStatus, setTransferStatus] = useState('initial');
  const [transferProgress, setTransferProgress] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);

  return (
    <main className="flex-1 flex justify-between p-12">
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">发送文件</h4>
        {transferStatus === 'initial' && <ConnectionStatusIndicatorCard spinner={true} message={'正在连接发送方...'} />}
        {transferStatus === 'connected' && (
          <ConnectionStatusIndicatorCard spinner={false} message={'连接成功建立，等待发送方选择文件并发送'} />
        )}
        {transferStatus === 'transferring' && !fileMeta && (
          <ConnectionStatusIndicatorCard spinner={false} message={'发送方开始发送文件，等待元数据...'} />
        )}
        {transferStatus === 'transferring' && fileMeta && (
          <CardContainer
            mask={
              <>
                <FileIcon />
                <div>
                  <p>{fileMeta.name}</p>
                </div>
              </>
            }
          >
            正在发送...
          </CardContainer>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">当前状态</h4>
        <Status />
      </div>
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">接收文件</h4>
        {!['transferring', 'completed'].includes(transferStatus) ? (
          <PanelContainer>等待中...</PanelContainer>
        ) : (
          <ReceiverFileCard fileName={fileMeta.name} progress={transferProgress} />
        )}
      </div>
    </main>
  );
};
