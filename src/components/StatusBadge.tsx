import React from 'react';
import { Circle } from 'lucide-react';

type StatusType = 'running' | 'stopped' | 'error' | 'provisioning';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'running':
        return 'text-green-500';
      case 'stopped':
        return 'text-red-500';
      case 'error':
        return 'text-red-500';
      case 'provisioning':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center">
      <Circle size={12} fill="currentColor" className={`${getStatusColor(status)}`} />
      <span className="ml-1 text-sm text-gray-700">{status}</span>
    </div>
  );
};