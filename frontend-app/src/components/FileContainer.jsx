import React from 'react';

export const FileContainer = ({ title, children }) => (
  <div>
    <h4 className="text-gray-300 font-zcool text-3xl tracking-wide mb-4">{title}</h4>
    <div className="text-center border-dashed border-4 rounded-md border-gray-500 p-2">{children}</div>
  </div>
);
