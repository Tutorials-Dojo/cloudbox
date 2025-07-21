import React from 'react';

interface PreviewProps {
  /**
   * The URL to load in the preview iframe. This will be the address of the server
   * running inside the Firecracker VM.
   */
  previewUrl: string;
}

export const Preview: React.FC<PreviewProps> = ({ previewUrl }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>
      <div className="flex-1">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Live Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        ) : (
          <div className="p-4 text-gray-500 text-sm flex items-center justify-center h-full">
            <p>Click "Run" to start the server and see the live preview.</p>
          </div>
        )}
      </div>
    </div>
  );
};