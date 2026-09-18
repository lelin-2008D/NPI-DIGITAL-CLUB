import React, { useRef } from 'react';
import type { SiteDatabase } from '../../types/site';
import { StorageService } from '../../services/storageService';
import { SupabaseService } from '../../services/supabaseService';

interface DashboardPanelProps {
  data: SiteDatabase | null;
  onRefresh: () => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ data, onRefresh }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonStr = StorageService.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `npi_digital_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const success = await StorageService.importJSON(text);
        if (success) {
          alert('Database restored successfully from JSON backup!');
          onRefresh();
        } else {
          alert('Failed to parse database backup. Ensure structure is valid.');
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to restore the default database from default-data.json? Custom changes will be reset.')) {
      await StorageService.resetData();
      alert('Database restored to default snapshot.');
      onRefresh();
    }
  };

  const isSupabase = SupabaseService.isConfigured();

  return (
    <div className="panel active" id="dashboard-panel">
      <div className="panel-header">
        <h2 className="panel-title space-grotesk">Console Core & Metrics</h2>
        <span className="panel-subtitle">
          Overview of live database entities and storage sync status.
        </span>
      </div>

      {/* Sync Status Banner */}
      <div className="sync-status-card glass-panel mb-6 p-4 rounded-xl flex items-center justify-between border border-border-color">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isSupabase ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <div>
            <h4 className="space-grotesk font-bold text-sm">
              Backend Storage Mode: {isSupabase ? 'Supabase Connected' : 'Local Storage Fallback'}
            </h4>
            <p className="text-xs opacity-70">
              {isSupabase
                ? 'All updates sync in real-time to your remote Supabase database.'
                : 'Updates are stored in local browser cache. Configure .env with Supabase credentials for cloud sync.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="metric-box glass-panel p-4 rounded-xl border border-border-color text-center">
          <span className="metric-count space-grotesk text-3xl font-bold accent-gold">
            {data?.whatWeDo?.cards?.length || 0}
          </span>
          <span className="metric-label space-mono text-xs opacity-70 block mt-1">Domain Tracks</span>
        </div>

        <div className="metric-box glass-panel p-4 rounded-xl border border-border-color text-center">
          <span className="metric-count space-grotesk text-3xl font-bold accent-gold">
            {data?.projects?.length || 0}
          </span>
          <span className="metric-label space-mono text-xs opacity-70 block mt-1">Projects</span>
        </div>

        <div className="metric-box glass-panel p-4 rounded-xl border border-border-color text-center">
          <span className="metric-count space-grotesk text-3xl font-bold accent-gold">
            {data?.timeline?.length || 0}
          </span>
          <span className="metric-label space-mono text-xs opacity-70 block mt-1">Timeline Events</span>
        </div>

        <div className="metric-box glass-panel p-4 rounded-xl border border-border-color text-center">
          <span className="metric-count space-grotesk text-3xl font-bold accent-gold">
            {data?.team?.length || 0}
          </span>
          <span className="metric-label space-mono text-xs opacity-70 block mt-1">Committee Members</span>
        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="backup-section glass-panel p-6 rounded-xl border border-border-color">
        <h3 className="space-grotesk font-bold text-lg mb-2">Backup & Storage Management</h3>
        <p className="text-sm opacity-75 mb-6">
          Export full JSON snapshots of the site data or restore from previous backups.
        </p>

        <div className="flex flex-wrap gap-4">
          <button type="button" className="btn btn-magnetic btn-primary" onClick={handleExport}>
            <span className="btn-text">Export Backup JSON</span>
          </button>

          <button
            type="button"
            className="btn btn-magnetic btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="btn-text">Import Backup JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />

          <button
            type="button"
            className="btn btn-magnetic"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
            onClick={handleReset}
          >
            <span className="btn-text">Reset to Default Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
