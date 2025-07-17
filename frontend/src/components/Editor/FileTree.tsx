import React from 'react';
import { FileText, Folder } from 'lucide-react';

interface FileTreeProps {
  // We'll define FileNode properly in types/
  files: any[]; 
  activeFile: string;
  onSelect: (name: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, activeFile, onSelect }) => {
  return (
    <div>
      {Object.keys(files).map((name) => (
        <div 
          key={name}
          className={`flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-blue-50 ${
            activeFile === name ? 'bg-blue-100 text-blue-700' : ''
          }`}
          onClick={() => onSelect(name)}
        >
          <FileText size={16} />
          <span className="text-sm">{name}</span>
        </div>
      ))}
    </div>
  );
};