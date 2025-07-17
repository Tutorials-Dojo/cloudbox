import React from 'react';
import { FileTree } from '../Editor/FileTree';
import { StatusBar } from './Statusbar';
import { FileNode } from '../../types/files';

interface SidebarProps {
  files: FileNode[];
  activeFile: string;
  onFileSelect: (path: string) => void;
  vmStatus: 'running' | 'starting' | 'stopped';
}

export const Sidebar: React.FC<SidebarProps> = ({ files, activeFile, onFileSelect, vmStatus }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Files</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Pass the props down to the FileTree component */}
        <FileTree files={files} activeFile={activeFile} onSelect={onFileSelect} />
      </div>
      <div className="p-3 border-t border-gray-200">
        <StatusBar status={vmStatus} />
      </div>
    </div>
  );
};