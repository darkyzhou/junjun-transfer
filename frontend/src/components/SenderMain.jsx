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
import { ErrorMessagePanel } from './panel/ErrorMessagePanel';

export const SenderMain = ({ socket, jobId, serversInfo, errorMessage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSender, setFileSender] = useState(null);
  const [transferStatus, setTransferStatus] = useState('initial');
  const [transferStats, setTransferStats] = useState({ speed: 0, progress: 0, current: 0 });

  const receiverUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.hash = jobId;
    return url.toString();
  }, [jobId]);

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

    bootstrapper.bootstrap(serversInfo).then(() => socket.connect());
  }, []); // TODO: no socket for deps, is it ok?

  useEffect(() => {
    if (!fileSender || !socket) {
      return;
    }
    socket.on('EVENT_RECEIVER_PROGRESS', ({ avgSpeed, speed, current, goal }) => {
      setTransferStats({
        speed,
        avgSpeed,
        progress: Math.floor((100 * current) / goal),
        current
      });
      if (current === goal) {
        setTransferStatus('completed');
      }
    });
  }, [fileSender, socket]);

  return (
    <main className="p-2 grid grid-cols-2 grid-rows-1 gap-4">
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-2 xl:mb-4">????????????</h4>
        {!selectedFile && (
          <SenderInstructionPanel
            className="flex-1 w-full"
            onSelectFile={(file) => {
              if (file.size > 0) {
                setSelectedFile(file);
              }
            }}
          />
        )}
        {selectedFile && (
          <SenderSelectedFileCard
            className="flex-1 w-full"
            file={selectedFile}
            canSend={!!fileSender}
            sending={transferStatus === 'transferring'}
            onCancel={() => {
              if (transferStatus === 'completed') {
                setTransferStatus('ready');
              }
              setSelectedFile(null);
            }}
            onConfirm={onConfirm}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-2 xl:mb-4">????????????</h4>
        {!errorMessage && (
          <>
            {transferStatus === 'initial' && <ReceiverInstructionPanel className="flex-1" url={receiverUrl} />}
            {transferStatus === 'connected' && (
              <ConnectionStatusIndicatorCard
                className="flex-1"
                message={'????????????????????????????????????????????????????????? WebRTC ??????...'}
              />
            )}
            {transferStatus === 'ready' && (
              <ConnectionStatusIndicatorCard
                className="flex-1"
                message={'??????????????????????????????????????????????????????????????????????????????'}
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
                avgSpeed={transferStats.avgSpeed}
              />
            )}
          </>
        )}
        {errorMessage && <ErrorMessagePanel className="flex-1 w-full" message={errorMessage} />}
      </div>
    </main>
  );
};
