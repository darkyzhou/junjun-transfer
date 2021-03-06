import React, { useEffect, useState } from 'react';
import { ReceiverFileCard } from './card/ReceiverFileCard';
import { CardContainer } from './card/CardContainer';
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
import { ErrorMessagePanel } from './panel/ErrorMessagePanel';

export const ReceiverMain = ({ socket, serversInfo, errorMessage }) => {
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

    bootstrapper.bootstrap(serversInfo).then(() => socket.connect());
  }, []); // TODO: no socket for deps, it is ok?

  useEffect(() => {
    if (!fileReceiver || !socket) {
      return;
    }
    fileReceiver.addEventListener(EVENT_META_RECEIVED, ({ detail: { meta } }) => {
      setTransferStatus('transferring');
      setFileMeta(meta);
    });
    fileReceiver.addEventListener(EVENT_FILE_RECEIVED, () => setTransferStatus('completed'));
    const { speedMonitor } = fileReceiver;
    speedMonitor.addEventListener(EVENT_TRANSFER_SPEED_UPDATE, ({ detail: { avgSpeed, speed, current, goal } }) => {
      setTransferStats({
        speed,
        avgSpeed,
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
  }, [fileReceiver, socket]);

  return (
    <main className="p-2 grid grid-cols-2 grid-rows-1 gap-4">
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-2 xl:mb-4">????????????</h4>
        {!errorMessage && (
          <>
            {transferStatus === 'initial' && (
              <ConnectionStatusIndicatorCard className="flex-1" message={'?????????????????????...'} />
            )}
            {transferStatus === 'connected' && (
              <ConnectionStatusIndicatorCard className="flex-1" message={'?????????????????? WebRTC ??????...'} />
            )}
            {transferStatus === 'ready' && (
              <ConnectionStatusIndicatorCard className="flex-1" message={'?????????????????????????????????????????????????????????'} />
            )}
            {transferStatus === 'transferring' && !fileMeta && (
              <ConnectionStatusIndicatorCard className="flex-1" message={'?????????????????????????????????????????????...'} />
            )}
            {transferStatus === 'transferring' && fileMeta && (
              <CardContainer className="flex-1" bottom={<div className="text-center text-sm p-2">????????????...</div>}>
                <FileInfo name={fileMeta.name} size={fileMeta.size} type={fileMeta.type} />
              </CardContainer>
            )}
            {transferStatus === 'completed' && (
              <CardContainer className="flex-1" bottom={<div className="text-center text-sm p-2">????????????</div>}>
                <FileInfo name={fileMeta.name} size={fileMeta.size} type={fileMeta.type} />
              </CardContainer>
            )}
          </>
        )}
        {errorMessage && <ErrorMessagePanel className="flex-1 w-full" message={errorMessage} />}
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-2 xl:mb-4">????????????</h4>
        {!fileMeta && <PanelContainer className="flex-1 text-gray-400 w-full">?????????...</PanelContainer>}
        {fileMeta && (
          <ReceiverFileCard
            className="flex-1"
            fileName={fileMeta.name}
            receivedSize={transferStats.current}
            type={fileMeta.type}
            progress={transferStats.progress}
            speed={transferStats.speed}
            avgSpeed={transferStats.avgSpeed}
          />
        )}
      </div>
    </main>
  );
};
