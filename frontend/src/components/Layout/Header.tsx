// frontend/src/components/Layout/Header.tsx
import React from 'react';
import { Play, Save, Settings } from 'lucide-react';

interface HeaderProps {
  onRun: () => void;
  isRunDisabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRun, isRunDisabled }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-blue-600">Tutorial Dojo</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunDisabled}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Play size={16} />
            {isRunDisabled ? 'Starting...' : 'Run'}
          </button>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            <Save size={16} />
            Save
          </button>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};