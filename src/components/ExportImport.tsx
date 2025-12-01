import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Storage } from '../utils/storage';

interface ExportImportProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onClearConfirm: () => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ onSuccess, onError, onClearConfirm }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = Storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rei-voice-pro-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onSuccess('Data exported successfully');
    } catch (error) {
      onError('Failed to export data');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = Storage.importData(text);
      
      if (result.success) {
        onSuccess('Data imported successfully. Please refresh the page.');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        onError(result.error || 'Failed to import data');
      }
    } catch (error) {
      onError('Failed to read file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
        title="Export data"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      
      <button
        onClick={handleImport}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
        title="Import data"
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </button>
      
      <button
        onClick={onClearConfirm}
        className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm"
        title="Clear all data"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Clear</span>
      </button>
    </div>
  );
};
