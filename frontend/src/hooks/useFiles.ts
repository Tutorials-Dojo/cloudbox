import { useState, useEffect } from 'react';
import { fetchFiles } from '../services/api';

export const useFiles = () => {
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial files
    fetchFiles().then(initialFiles => {
      setFiles(initialFiles);
      setActiveFile(Object.keys(initialFiles)[0] || '');
      setIsLoading(false);
    });
  }, []);

  const updateFileContent = (fileName: string, content: string) => {
    setFiles(prev => ({ ...prev, [fileName]: content }));
  };

  return { files, activeFile, setActiveFile, updateFileContent, isLoading };
};