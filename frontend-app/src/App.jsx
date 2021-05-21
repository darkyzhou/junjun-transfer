import React, { useState, useEffect, useMemo } from 'react';
import { SenderMain } from './components/SenderMain';
import { makeJobId, makeReceiverSocket, makeSenderSocket } from './signal/signal-utils';
import { Spinner } from './components/shared/Spinner';
import { ReceiverMain } from './components/ReceiverMain';
import { Button } from './components/shared/Button';
import { EVENT_NEW_LOG, LOGGER } from './utils/logger';

const params = new URLSearchParams(window.location.search);
const jobIdFromQuery = params.get('job_id');
const isSender = !jobIdFromQuery;

const App = () => {
  const [jobId, setJobId] = useState(jobIdFromQuery);
  const [socket, setSocket] = useState(null);
  const [iceServersInfo, setIceServersInfo] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [logMessages, setLogMessages] = useState('');

  const initializing = useMemo(() => !socket || !iceServersInfo, [socket, iceServersInfo]);

  useEffect(() => {
    LOGGER.addEventListener(EVENT_NEW_LOG, ({ detail: { level, args } }) => {
      setLogMessages((prev) => `${prev ? prev + '\n' : ''}${args.join(' ')}`);
    });
  }, []);

  useEffect(() => {
    let socket;
    if (isSender) {
      const id = makeJobId();
      socket = makeSenderSocket(id);
      setJobId(id);
    } else {
      socket = makeReceiverSocket(jobId);
    }
    socket.on('connect', () => setSocket(socket));
  }, []);

  useEffect(async () => {
    const response = await fetch('/ice');
    const info = await response.json();
    setIceServersInfo(info);
  }, []);

  return (
    <div className="bg-gray-900 relative">
      <div className="max-w-[850px] mx-auto h-screen flex flex-col">
        <div className="relative z-10 flex-none text-center text-gray-300 my-8 p-1">
          <h2 className="text-gray-200 font-zcool text-6xl sm:text-8xl tracking-wider mb-2 sm:mb-4">俊俊快传</h2>
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
        <div className="relative z-10 flex-1">
          {initializing && (
            <main className="p-12 text-gray-300 flex flex-col items-center">
              <Spinner className="w-36 h-36" />
              <p>正在连接</p>
            </main>
          )}
          {!initializing && isSender && <SenderMain socket={socket} jobId={jobId} serversInfo={iceServersInfo} />}
          {!initializing && !isSender && <ReceiverMain socket={socket} serversInfo={iceServersInfo} />}
        </div>
        <div className="flex-1 mx-auto text-gray-400 flex flex-col-reverse w-full items-center">
          <Button
            className="mt-2 !px-2 !py-1 text-xs sm:text-sm flex-none rounded w-max"
            onClick={() => setShowLog(!showLog)}
          >
            查看日志
          </Button>
          {showLog && (
            <div className="flex-1 bg-gray-800 w-full overflow-auto relative">
              <pre className="p-2 sm:p-4 absolute inset-0 text-xs sm:text-sm">{logMessages}</pre>
            </div>
          )}
        </div>
        <footer className="relative z-10 flex-none text-center text-gray-400 p-2 text-xs sm:text-sm">
          <p>
            Made with ❤️ by{' '}
            <a href="https://darkyzhou.net" className="underline">
              darkyzhou
            </a>
          </p>
          <p>
            网站的图标来自 Twitter，遵循{' '}
            <a className="underline" href="https://creativecommons.org/licenses/by/4.0/">
              CC-BY 4.0
            </a>{' '}
            协议
          </p>
          <p>可爱的猫咪图片来自 master1305、wirestock 和 winkimages</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
