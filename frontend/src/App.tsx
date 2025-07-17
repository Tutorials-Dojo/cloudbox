import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { Preview } from './components/Editor/Preview';
import { useFiles } from './hooks/useFiles';
import { FileNode } from './types/files';
// Other components and hooks...

const IDEPage = () => {
    const { files, activeFile, setActiveFile, updateFileContent, isLoading } = useFiles();
    // Add states for VM, preview, etc.
    const [isRunDisabled, setIsRunDisabled] = useState(false);
    const [vmStatus, setVmStatus] = useState<'running' | 'starting' | 'stopped'>('stopped');

    const handleRun = () => {
        console.log("Running code...");
        // This is where you would call your backend's VM/container service
    };

    const handleFileChange = (content: string | undefined) => {
        if (activeFile && typeof content === 'string') {
            updateFileContent(activeFile, content);
        }
    };
    
    if (isLoading) {
        return <div>Loading Workspace...</div>;
    }

    return (
        <div className="h-screen flex flex-col">
            <Header onRun={handleRun} isRunDisabled={isRunDisabled} />
            <div className="flex-1 flex">
                <Sidebar 
                    // This needs to be adapted for your FileNode structure
                    files={Object.keys(files).map(name => ({ name, path: name, type: 'file' }))} 
                    activeFile={activeFile}
                    onFileSelect={setActiveFile}
                    vmStatus={vmStatus}
                />
                <main className="flex-1 flex">
                    <div className="w-1/2">
                        <CodeEditor 
                            language="javascript" // This should be dynamic based on file type
                            value={files[activeFile] || ''}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <Preview htmlContent={files['index.html'] || ''} />
                    </div>
                </main>
            </div>
        </div>
    );
};