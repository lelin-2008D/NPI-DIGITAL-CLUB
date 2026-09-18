import React, { useState } from 'react';

export const LivePreview: React.FC = () => {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="preview-column glass-panel">
      <div className="preview-header flex justify-between items-center p-4 border-b border-border-color">
        <div className="flex items-center gap-2">
          <span className="space-mono text-xs opacity-60">LIVE PREVIEW</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <button
          type="button"
          className="btn btn-secondary px-3 py-1 text-xs space-mono"
          onClick={handleRefresh}
          title="Reload preview iframe"
        >
          ↻ Refresh Frame
        </button>
      </div>

      <div className="preview-frame-box h-full overflow-hidden bg-bg-primary">
        <iframe
          key={key}
          src="/"
          title="Live Website Preview"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
