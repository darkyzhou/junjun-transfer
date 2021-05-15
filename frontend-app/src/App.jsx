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
    <div className="bg-gray-900 min-h-screen flex flex-col justify-between">
      <div className="flex-none text-center text-gray-300 my-8">
        <h2 className="text-gray-200 font-zcool text-8xl tracking-wider mb-2">俊俊快传</h2>
        <p className="text-xl text-gray-400 tracking-wider">一个基于 WebRTC 技术的浏览器点对点文件传输工具</p>
      </div>
      {!socket && (
        <main className="flex-1 p-12 text-gray-300 flex flex-col items-center">
          <Spinner className="w-36 h-36" />
          <p>正在连接信令服务器...</p>
        </main>
      )}
      {socket && isSender && <SenderMain socket={socket} jobId={jobId} />}
      {socket && !isSender && <ReceiverMain socket={socket} />}
      <footer className="flex-none text-center text-gray-400 p-2">Made with ❤️ by darkyzhou</footer>
    </div>
  );
};

export default App;
