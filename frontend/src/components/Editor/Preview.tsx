import React from 'react';

/**
 * Defines the props for the Preview component.
 */
interface PreviewProps {
  /**
   * A string containing the HTML content to be rendered in the preview pane.
   */
  htmlContent: string;
}

/**
 * A component that renders a live preview of HTML content in a sandboxed iframe.
 */
export const Preview: React.FC<PreviewProps> = ({ htmlContent }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header for the Preview Pane */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Preview</span>
      </div>

      {/* The iframe where the content is rendered */}
      <div className="flex-1 bg-white">
        {htmlContent ? (
          <iframe
            // The srcDoc attribute is the key here. It takes a string of HTML
            // and renders it in the frame. This is safer than using dangerouslySetInnerHTML.
            srcDoc={htmlContent}
            title="Live Preview"
            // Sandbox attributes can be added for extra security, but for an MVP
            // allowing scripts is necessary to see JavaScript interactions.
            sandbox="allow-scripts"
            className="w-full h-full border-none"
          />
        ) : (
          // Display a helpful message if there's no HTML to preview
          <div className="p-4 text-gray-500 text-sm flex items-center justify-center h-full">
            <p>No HTML content to preview. Open an HTML file to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};