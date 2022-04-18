import React, { useState, useEffect, useMemo } from 'react';
import { SenderMain } from './components/SenderMain';
import { makeJobId, makeReceiverSocket, makeSenderSocket } from './signal/signal-utils';
import { Spinner } from './components/shared/Spinner';
import { ReceiverMain } from './components/ReceiverMain';
import { Button } from './components/shared/Button';
import { LOGGER } from './utils/logger';
import styled from 'styled-components';
import { LogPanel } from './components/LogPanel';
import { IceServersPanel } from './components/IceServersPanel';

const jobIdFromHash = window.location.hash.slice(1);
const isSender = !jobIdFromHash;

const Background = styled.div`
  background-color: #111827;
  background-image: url("data:image/svg+xml,%3Csvg width='128' height='128' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239ca3af' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E");
`;

const HeadTitle = styled.h2`
  background: -webkit-linear-gradient(#e5e7eb 40%, #9ca3af 70%, #6b7280);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const App = () => {
  const [jobId, setJobId] = useState(jobIdFromHash);
  const [socket, setSocket] = useState(null);
  const [iceServersInfo, setIceServersInfo] = useState(null);
  const [showIceServers, setShowIceServers] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const initializing = useMemo(() => !socket || !iceServersInfo, [socket, iceServersInfo]);

  useEffect(() => {
    window.onerror = function (message, url, lineNo, columnNo, error) {
      LOGGER.error('[App] caught javascript runtime error', {
        message,
        url,
        lineNo,
        columnNo,
        error
      });
      setShowLog(true);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      window.addEventListener('unload', () => socket.close());
    }
  }, [socket]);

  useEffect(() => {
    let socket;
    if (isSender) {
      const id = makeJobId();
      socket = makeSenderSocket(id);
      LOGGER.debug('[App] connecting to signal server as sender, jobId:', id);
      setJobId(id);
    } else {
      socket = makeReceiverSocket(jobId);
      LOGGER.debug('[App] connecting to signal server as receiver, jobId:', jobId);
    }

    socket.on('ERROR', ({ message }) => {
      LOGGER.error('[App] got error from signal server', message);
      setErrorMessage(message);
    });
    socket.on('EVENT_PEER_LEFT', () => {
      LOGGER.info('[App] the peer has left');
      setErrorMessage('对方已经关闭俊俊快传');
    });
    socket.on('disconnect', (reason) => {
      LOGGER.info('[App] disconnected from signal server, reason:', reason);
      if (['io server disconnect', 'io client disconnect'].includes(reason)) {
        setErrorMessage((prev) => `信令连接已断开：${reason}${prev ? `（${prev}）` : ''}`);
      }
    });
    socket.on('connect', () => {
      LOGGER.info('[App] connected to signal server');
    });
    setSocket(socket);
  }, []);

  useEffect(async () => {
    const response = await fetch('/ice');
    const info = await response.json();
    LOGGER.debug('[App] got ice info', info);
    setIceServersInfo(info);
  }, []);

  return (
    <Background className="bg-gray-900 relative">
      <div className="max-w-[850px] mx-auto h-screen flex flex-col">
        <div className="relative z-10 flex-none text-center text-gray-300 my-4 xl:my-6">
          <HeadTitle className="text-gray-200 font-zcool text-6xl sm:text-8xl tracking-wider mb-2">俊俊快传</HeadTitle>
          <p className="text-sm sm:text-xl text-gray-400 tracking-wider">基于 WebRTC 技术的浏览器点对点文件传输工具</p>
          <p className="flex items-center justify-center text-sm">
            <a
              href="https://github.com/darkyzhou/junjun-transfer"
              className="inline-block text-gray-400 leading-5 hover:text-gray-200 transition-colors mr-2"
            >
              <span className="inline-flex self-center pr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="h-[1em] relative top-[0.125em] inline-block"
                  aria-hidden="true"
                  role="img"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              GitHub 仓库
            </a>
            <a href="https://github.com/darkyzhou/junjun-transfer" className="pb-1">
              <img
                className="inline"
                src="https://img.shields.io/github/stars/darkyzhou/junjun-transfer?style=social"
              />
            </a>
          </p>
        </div>
        <div className="relative z-10 flex-none">
          {initializing && (
            <main className="p-12 text-gray-300 flex flex-col items-center">
              <Spinner className="w-24 h-24 mb-4" />
              <p className="text-xl">正在连接</p>
            </main>
          )}
          {!initializing && isSender && (
            <SenderMain socket={socket} jobId={jobId} serversInfo={iceServersInfo} errorMessage={errorMessage} />
          )}
          {!initializing && !isSender && (
            <ReceiverMain socket={socket} serversInfo={iceServersInfo} errorMessage={errorMessage} />
          )}
        </div>
        <div className="flex-1 mx-auto text-gray-400 flex flex-col-reverse w-full items-center">
          <div className="flex-none flex">
            {iceServersInfo && (
              <Button
                className="mt-2 !px-2 !py-1 text-xs sm:text-sm flex-none rounded w-max mr-2"
                onClick={() => {
                  setShowIceServers(!showIceServers);
                  setShowLog(false);
                }}
              >
                查看 ICE 服务器
              </Button>
            )}
            <Button
              className="mt-2 !px-2 !py-1 text-xs sm:text-sm flex-none rounded w-max"
              onClick={() => {
                setShowLog(!showLog);
                setShowIceServers(false);
              }}
            >
              查看日志
            </Button>
          </div>
          <div
            className={`flex-1 w-full rounded overflow-auto relative ${showIceServers && 'flex flex-col-reverse'}`}
            hidden={!showIceServers}
          >
            <IceServersPanel iceServersInfo={iceServersInfo?.servers} />
          </div>
          <div className="flex-1 w-full relative rounded" hidden={!showLog}>
            <LogPanel />
          </div>
        </div>
        <footer className="relative z-10 flex-none text-center text-gray-400 p-2 text-xs sm:text-sm">
          <p>
            Made with ❤️ by{' '}
            <a href="https://darkyzhou.net" className="underline">
              darkyzhou
            </a>
          </p>
        </footer>
      </div>
    </Background>
  );
};

export default App;
