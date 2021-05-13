import React, { useState, useEffect } from 'react';
import { SenderMain } from './components/SenderMain';
import { makeSenderSocket } from './signal/signal-utils';
import { Spinner } from './components/Spinner';

const jobId = new URLSearchParams(window.location.search).get('job_id');
const isSender = !jobId;

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = makeSenderSocket();
    socket.on('connect', () => setSocket(socket));
  });

  return (
    <div className="bg-gray-700 min-h-screen flex flex-col justify-between">
      <div className="flex-none text-center text-gray-300 my-8">
        <h2 className="text-gray-200 font-zcool text-8xl tracking-wider mb-2">俊俊快传</h2>
        <p className="text-xl text-gray-400 tracking-wider">一个基于 WebRTC 技术的浏览器点对点文件传输工具</p>
      </div>
      {!socket && (
        <main>
          <Spinner />
        </main>
      )}
      {socket && isSender && <SenderMain socket={socket} />}
      <footer className="flex-none text-center text-gray-400 p-2">Made with ❤️ by darkyzhou</footer>
    </div>
  );
};

export default App;
