import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { CodeEditor } from './components/Editor/CodeEditor';
import { Preview } from './components/Editor/Preview';
import { useFiles } from './hooks/useFiles';
import { runProject } from './services/api'; // Import the API function
import './index.css'; // Make sure Tailwind styles are imported

const App = () => {
    const { files, activeFile, setActiveFile, updateFileContent, isLoading } = useFiles();
    const [isRunDisabled, setIsRunDisabled] = useState(false);
    const [vmStatus, setVmStatus] = useState<'running' | 'starting' | 'stopped'>('stopped');
    const [previewUrl, setPreviewUrl] = useState<string>(''); // State for the preview URL

    const handleRun = async () => {
        setIsRunDisabled(true);
        setVmStatus('starting');
        setPreviewUrl(''); // Clear previous URL while starting
        try {
            const result = await runProject(files);
            if (result.success && result.url) {
                setPreviewUrl(result.url); // Set the new URL from the backend
                setVmStatus('running');
            } else {
                alert(`Failed to run project: ${result.message}`);
                setVmStatus('stopped');
            }
        } catch (error) {
            console.error("Error calling run API:", error);
            alert('An error occurred while trying to run the code. Check the console.');
            setVmStatus('stopped');
        } finally {
            setIsRunDisabled(false);
        }
    };

    const handleFileChange = (content: string | undefined) => {
        if (activeFile && typeof content === 'string') {
            updateFileContent(activeFile, content);
        }
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading Workspace...</div>;
    }

    const getLanguage = (fileName: string) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                return 'javascript';
            case 'css':
                return 'css';
            case 'html':
                return 'html';
            default:
                return 'plaintext';
        }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <Header onRun={handleRun} isRunDisabled={isRunDisabled} />
            <div className="flex-1 flex min-h-0"> {/* Use min-h-0 to prevent overflow */}
                <Sidebar 
                    files={Object.keys(files).map(name => ({ name, path: name, type: 'file' }))} 
                    activeFile={activeFile}
                    onFileSelect={setActiveFile}
                    vmStatus={vmStatus}
                />
                <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                    <div className="bg-white h-full">
                        <CodeEditor 
                            language={getLanguage(activeFile)}
                            value={files[activeFile] || ''}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="bg-white h-full">
                        <Preview previewUrl={previewUrl} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;