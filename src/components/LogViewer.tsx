import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';

interface LogViewerProps {
  vmName: string;
  socket: any;
}

export const LogViewer: React.FC<LogViewerProps> = ({ vmName, socket }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('requestLogs', vmName);

    socket.on('vmLogs', (data: { vmName: string; log: string }) => {
      if (data.vmName === vmName) {
        setLogs(prev => [...prev, data.log]);
        
        // Auto-scroll to bottom
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }
    });

    return () => {
      socket.off('vmLogs');
    };
  }, [socket, vmName]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal size={16} className="text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">Logs</h3>
      </div>
      <div
        ref={logContainerRef}
        className="bg-gray-900 text-gray-100 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs available...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};