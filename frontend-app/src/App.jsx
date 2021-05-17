import React, { useState, useEffect } from 'react';
import { SenderMain } from './components/SenderMain';
import { makeJobId, makeReceiverSocket, makeSenderSocket } from './signal/signal-utils';
import { Spinner } from './components/Spinner';
import { ReceiverMain } from './components/ReceiverMain';

const jobIdFromQuery = new URLSearchParams(window.location.search).get('job_id');
const isSender = !jobIdFromQuery;

const App = () => {
  const [jobId, setJobId] = useState(jobIdFromQuery);
  const [socket, setSocket] = useState(null);

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

  return (
    <div className="bg-gray-900">
      <div className="max-w-[850px] mx-auto h-screen flex flex-col">
        <div className="flex-none text-center text-gray-300 my-8 z-10">
          <h2 className="text-gray-200 font-zcool text-8xl tracking-wider mb-4">俊俊快传</h2>
          <p className="text-xl text-gray-400 tracking-wider">一个基于 WebRTC 技术的浏览器点对点文件传输工具</p>
          <p className="flex items-center justify-center">
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
                  ></path>
                </svg>
              </span>
              GitHub 仓库
            </a>
            <a href="https://github.com/darkyzhou/junjun-transfer" className="pb-1">
              <img
                className="inline "
                src="https://img.shields.io/github/stars/darkyzhou/junjun-transfer?style=social"
              />
            </a>
          </p>
        </div>
        <div className="flex-1">
          {!socket && (
            <main className="p-12 text-gray-300 flex flex-col items-center">
              <Spinner className="w-36 h-36" />
              <p>正在连接信令服务器...</p>
            </main>
          )}
          {socket && isSender && <SenderMain socket={socket} jobId={jobId} />}
          {socket && !isSender && <ReceiverMain socket={socket} />}
        </div>
        <footer className="flex-none text-center text-gray-400 p-2">
          Made with ❤️ by{' '}
          <a href="https://darkyzhou.net" className="underline">
            darkyzhou
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
