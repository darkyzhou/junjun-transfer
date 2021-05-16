import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Status } from './Status';
import { ConnectionStatusIndicatorCard } from './card/ConnectionStatusIndicatorCard';
import {
  EVENT_ANSWER_RECEIVED,
  EVENT_CHANNEL_OPEN,
  SenderDataChannelBootstrapper
} from '../webrtc/bootstrap/sender-data-channel-bootstrapper';
import { ReceiverInstructionPanel } from './panel/ReceiverInstructionPanel';
import { ReceiverFileCard } from './card/ReceiverFileCard';
import { FileSender } from '../webrtc/file/file-sender';
import {
  EVENT_TRANSMISSION_COMPLETED,
  EVENT_TRANSMISSION_PROGRESS
} from '../webrtc/data-channel/data-channel-transmitter';
import { SenderSelectedFileCard } from './card/SenderSelectedFileCard';
import { SenderInstructionPanel } from './panel/SenderInstructionPanel';
import { CardContainer } from './card/CardContainer';
import { FileIcon } from './FileIcon';

export const SenderMain = ({ socket, jobId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSender, setFileSender] = useState(null);
  const [transferStatus, setTransferStatus] = useState('initial');
  const [transferStats, setTransferStats] = useState({ speed: 0, progress: 0, current: 0 });

  const receiverUrl = useMemo(() => `${window.location.href}?job_id=${window.encodeURIComponent(jobId)}`, [jobId]);

  const onConfirm = useCallback(() => {
    setTransferStatus('transferring');
    fileSender.send(selectedFile);
  }, [selectedFile, fileSender]);

  useEffect(() => {
    const bootstrapper = new SenderDataChannelBootstrapper(socket);

    bootstrapper.addEventListener(EVENT_ANSWER_RECEIVED, () => setTransferStatus('connected'));
    bootstrapper.addEventListener(EVENT_CHANNEL_OPEN, ({ detail: { connection, channel } }) => {
      setFileSender(new FileSender(connection, channel));
      setTransferStatus('ready');
    });

    bootstrapper.bootstrap();
  }, [socket]);

  useEffect(() => {
    if (!fileSender) {
      return;
    }
    const { transmitter } = fileSender;
    socket.on('EVENT_RECEIVER_PROGRESS', ({ avgSpeed, speed, current, goal }) => {
      setTransferStats({
        speed: speed <= 0 ? avgSpeed : speed,
        progress: Math.floor((100 * current) / goal),
        current
      });
      if (current === goal) {
        setTransferStatus('completed');
      }
    });
  }, [fileSender]);

  return (
    <main className="flex-1 flex justify-between p-12">
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">发送文件</h4>
        {!selectedFile && <SenderInstructionPanel onSelectFile={(file) => setSelectedFile(file)} />}
        {selectedFile && (
          <SenderSelectedFileCard
            file={selectedFile}
            canSend={!!fileSender}
            sending={transferStatus === 'transferring'}
            onCancel={() => {
              setSelectedFile(null);
              setTransferStatus('ready');
            }}
            onConfirm={onConfirm}
          />
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">当前状态</h4>
        <Status />
      </div>
      <div className="flex-none">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">接收文件</h4>
        {transferStatus === 'initial' && <ReceiverInstructionPanel url={receiverUrl} />}
        {transferStatus === 'connected' && (
          <ConnectionStatusIndicatorCard
            spinner={true}
            message={'伙伴已经打开了俊俊快传，浏览器正在建立 WebRTC 连接...'}
          />
        )}
        {transferStatus === 'ready' && (
          <ConnectionStatusIndicatorCard
            spinner={false}
            message={'伙伴已经连接到你的浏览器，就等你选好文件开始发送了！'}
          />
        )}
        {(transferStatus === 'transferring' || transferStatus === 'completed') && (
          <ReceiverFileCard
            fileName={selectedFile.name}
            receivedSize={transferStats.current}
            progress={transferStats.progress}
            speed={transferStats.speed}
          />
        )}
      </div>
    </main>
  );
};
