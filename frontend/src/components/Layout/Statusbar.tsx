import React from 'react';

interface StatusBarProps {
  status: 'running' | 'starting' | 'stopped';
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'running':
        return { color: 'bg-green-500', text: 'Running' };
      case 'starting':
        return { color: 'bg-yellow-500', text: 'Starting...' };
      case 'stopped':
      default:
        return { color: 'bg-gray-400', text: 'Stopped' };
    }
  };

  const { color, text } = getStatusInfo();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-gray-600">VM: {text}</span>
    </div>
  );
};