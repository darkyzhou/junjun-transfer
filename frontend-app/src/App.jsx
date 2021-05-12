import React from 'react';
import { SenderInstructionPanel } from './components/SenderInstructionPanel';
import { ReceiverPanel } from './components/ReceiverPanel';
import { Status } from './components/Status';
import { SenderFilePanel } from './components/SenderFilePanel';

const App = ({ jobId, isSender }) => {
  return (
    <div className="bg-gray-700 min-h-screen flex flex-col justify-between">
      <div className="flex-none text-center text-gray-300 my-8">
        <h2 className="text-gray-200 font-zcool text-8xl tracking-wider mb-2">俊俊快传</h2>
        <p className="text-xl text-gray-400 tracking-wider">一个基于 WebRTC 技术的浏览器点对点文件传输工具</p>
      </div>
      <main className="flex-1 flex justify-between p-12">
        <div className="flex-none">
          <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">发送文件</h4>
          <SenderFilePanel file={new File([0,0,0,0,0,0,0,0,0], 'test.txt')} />
        </div>
        <div className="flex-1">
          <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">当前状态</h4>
          <Status />
        </div>
        <div className="flex-none">
          <h4 className="text-gray-200 font-zcool text-3xl tracking-widest mb-4 text-center">接收文件</h4>
          <ReceiverPanel />
        </div>
      </main>
      <footer className="flex-none text-center text-gray-400 p-2">Made with ❤️ by darkyzhou</footer>
    </div>
  );
};

export default App;
