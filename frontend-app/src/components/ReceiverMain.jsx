import React, { useEffect, useState } from 'react';
import { Status } from './Status';
import { ReceiverFileCard } from './card/ReceiverFileCard';
import { CardContainer } from './card/CardContainer';
import { FileIcon } from './FileIcon';
import { PanelContainer } from './panel/PanelContainer';
import { ConnectionStatusIndicatorCard } from './card/ConnectionStatusIndicatorCard';
import {
  EVENT_ANSWER_SENT,
  EVENT_CHANNEL_OPEN,
  ReceiverDataChannelBootstrapper
} from '../webrtc/bootstrap/receiver-data-channel-bootstrapper';
import { EVENT_FILE_RECEIVED, EVENT_META_RECEIVED, FileReceiver } from '../webrtc/file/file-receiver';
import { saveArraybufferAsFile } from '../utils/save-arraybuffer-as-file';
import { EVENT_TRANSFER_SPEED_UPDATE } from '../webrtc/file/transfer-speed-monitor';
import { FileInfo } from './shared/FileInfo';

export const ReceiverMain = ({ socket }) => {
  const [fileMeta, setFileMeta] = useState(null);
  const [fileReceiver, setFileReceiver] = useState(null);
  const [transferStatus, setTransferStatus] = useState('initial');
  const [transferStats, setTransferStats] = useState({ speed: 0, progress: 0, current: 0 });

  useEffect(() => {
    const bootstrapper = new ReceiverDataChannelBootstrapper(socket);

    bootstrapper.addEventListener(EVENT_ANSWER_SENT, () => setTransferStatus('connected'));
    bootstrapper.addEventListener(EVENT_CHANNEL_OPEN, async ({ detail: { channel } }) => {
      const receiver = new FileReceiver(channel);
      setFileReceiver(receiver);
      setTransferStatus('ready');

      for await (const { meta, fileBuffer } of receiver.receiveFiles()) {
        saveArraybufferAsFile(fileBuffer, meta.name, meta.type);
      }
    });

    bootstrapper.bootstrap();
  }, [socket]);

  useEffect(() => {
    if (!fileReceiver) {
      return;
    }
    const {
      receiver: { speedMonitor }
    } = fileReceiver;
    fileReceiver.addEventListener(EVENT_META_RECEIVED, ({ detail: { meta } }) => {
      setTransferStatus('transferring');
      setFileMeta(meta);
    });
    fileReceiver.addEventListener(EVENT_FILE_RECEIVED, () => setTransferStatus('completed'));
    speedMonitor.addEventListener(EVENT_TRANSFER_SPEED_UPDATE, ({ detail: { avgSpeed, speed, current, goal } }) => {
      setTransferStats({
        speed: speed <= 0 ? avgSpeed : speed,
        progress: Math.floor((100 * current) / goal),
        current
      });
      socket.emit('EVENT_RECEIVER_PROGRESS', {
        avgSpeed,
        speed,
        current,
        goal
      });
    });
  }, [fileReceiver]);

  return (
    <main className="flex-1 flex justify-between p-12">
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">发送文件</h4>
        {transferStatus === 'initial' && <ConnectionStatusIndicatorCard spinner={true} message={'正在连接发送方...'} />}
        {transferStatus === 'connected' && (
          <ConnectionStatusIndicatorCard spinner={true} message={'正在尝试建立 WebRTC 连接...'} />
        )}
        {transferStatus === 'ready' && (
          <ConnectionStatusIndicatorCard spinner={false} message={'连接成功建立，等待发送方选择文件并发送'} />
        )}
        {transferStatus === 'transferring' && !fileMeta && (
          <ConnectionStatusIndicatorCard spinner={false} message={'发送方开始发送文件，等待元数据...'} />
        )}
        {transferStatus === 'transferring' && fileMeta && (
          <CardContainer bottom={<div className="text-center text-sm p-2">正在发送...</div>}>
            <FileInfo name={fileMeta.name} size={fileMeta.size} type={fileMeta.type} />
          </CardContainer>
        )}
        {transferStatus === 'completed' && (
          <CardContainer bottom={<div className="text-center text-sm p-2">发送完成</div>}>
            <FileInfo name={fileMeta.name} size={fileMeta.size} type={fileMeta.type} />
          </CardContainer>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">当前状态</h4>
        <Status />
      </div>
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">接收文件</h4>
        {!fileMeta && <PanelContainer className="text-gray-400">等待中...</PanelContainer>}
        {fileMeta && (
          <ReceiverFileCard
            fileName={fileMeta.name}
            receivedSize={transferStats.current}
            type={fileMeta.type}
            progress={transferStats.progress}
            speed={transferStats.speed}
          />
        )}
      </div>
    </main>
  );
};
