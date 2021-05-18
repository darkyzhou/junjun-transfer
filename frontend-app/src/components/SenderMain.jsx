import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConnectionStatusIndicatorCard } from './card/ConnectionStatusIndicatorCard';
import {
  EVENT_ANSWER_RECEIVED,
  EVENT_CHANNEL_OPEN,
  SenderDataChannelBootstrapper
} from '../webrtc/bootstrap/sender-data-channel-bootstrapper';
import { ReceiverInstructionPanel } from './panel/ReceiverInstructionPanel';
import { ReceiverFileCard } from './card/ReceiverFileCard';
import { FileSender } from '../webrtc/file/file-sender';
import { SenderSelectedFileCard } from './card/SenderSelectedFileCard';
import { SenderInstructionPanel } from './panel/SenderInstructionPanel';

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
    <main className="p-4 md:p-8 lg:p-12 grid grid-cols-2 grid-rows-1 gap-4">
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 sm:mb-8">发送文件</h4>
        {!selectedFile && (
          <SenderInstructionPanel
            className="flex-1"
            onSelectFile={(file) => {
              if (file.size > 0) {
                setSelectedFile(file);
              }
            }}
          />
        )}
        {selectedFile && (
          <SenderSelectedFileCard
            className="flex-1"
            file={selectedFile}
            canSend={!!fileSender}
            sending={transferStatus === 'transferring'}
            onCancel={() => setSelectedFile(null)}
            onConfirm={onConfirm}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 sm:mb-8">接收文件</h4>
        {transferStatus === 'initial' && <ReceiverInstructionPanel className="flex-1" url={receiverUrl} />}
        {transferStatus === 'connected' && (
          <ConnectionStatusIndicatorCard
            className="flex-1"
            spinner={true}
            message={'伙伴已经打开了俊俊快传，浏览器正在建立 WebRTC 连接...'}
          />
        )}
        {transferStatus === 'ready' && (
          <ConnectionStatusIndicatorCard
            className="flex-1"
            spinner={false}
            message={'伙伴已经连接到你的浏览器，就等你选好文件开始发送了！'}
          />
        )}
        {(transferStatus === 'transferring' || transferStatus === 'completed') && (
          <ReceiverFileCard
            className="flex-1"
            fileName={selectedFile.name}
            receivedSize={transferStats.current}
            type={selectedFile.type}
            progress={transferStats.progress}
            speed={transferStats.speed}
          />
        )}
      </div>
    </main>
  );
};
