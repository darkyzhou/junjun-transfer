import React from 'react';
import { Sender } from './components/Sender';

const App = ({ jobId, isSender }) => {
  return (
    <main className="bg-gray-700 min-h-screen flex flex-col">
      <div className="flex-none text-center text-gray-300 my-8">
        <h2 className="text-gray-200 font-zcool text-8xl tracking-wider mb-2">俊俊快传</h2>
        <p>利用 WebRTC 技术实现的浏览器点对点文件传输工具</p>
      </div>
      <div className="w-screen flex justify-between p-12">
        <div className="text-center border-dashed border-4 border-gray-500 px-8 py-2">
          <h4 className="text-gray-300 font-zcool text-3xl tracking-wide">发送文件</h4>

        </div>
        <div className="text-center border-dashed border-4 border-gray-500 px-8 py-2">
          <h4 className="text-gray-300 font-zcool text-3xl tracking-wide">接收文件</h4>
        </div>
      </div>
    </main>
  );
};

export default App;
