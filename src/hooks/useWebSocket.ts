import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [vmMetrics, setVmMetrics] = useState<Record<string, { cpuUsage: number; memoryUsage: number; status: string }>>({});

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('vmMetrics', (data: any) => {
      setVmMetrics(prevMetrics => ({
        ...prevMetrics,
        [data.id]: {
          cpuUsage: data.cpuUsage,
          memoryUsage: data.memoryUsage,
          status: data.status
        }
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { vmMetrics, socket };
};