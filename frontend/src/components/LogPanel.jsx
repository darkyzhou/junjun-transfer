import React, { useEffect, useState } from 'react';
import { EVENT_NEW_LOG, LOGGER } from '../utils/logger';
import styled from 'styled-components';

const LogLine = styled.p`
  margin: 4px 0;
`;

export const LogPanel = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    LOGGER.addEventListener(EVENT_NEW_LOG, ({ detail: log }) => {
      setLogs((previous) => [...previous, log]);
    });
  }, []);

  return (
    <div className="m-2 p-1 pr-0 sm:p-2 absolute inset-0 text-xs font-mono break-all bg-gray-800 overflow-auto rounded">
      {logs.map(({ level, line }) => (
        <LogLine key={line} className={level === 'debug' ? 'text-gray-500' : level === 'error' ? 'text-pink-700' : ''}>
          {line}
        </LogLine>
      ))}
    </div>
  );
};
