'use client';

import { CSVData } from '@/types';
import { X } from 'lucide-react';

interface CSVPreviewProps {
  data: CSVData;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function CSVPreview({ data, onConfirm, onCancel, isProcessing }: CSVPreviewProps) {
  const previewRows = data.rows.slice(0, 10);
  const hasMoreRows = data.rows.length > 10;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CSV Preview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total rows: <span className="font-semibold">{data.totalRows || data.rows.length}</span>
            {hasMoreRows && ` (showing first 10)`}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          disabled={isProcessing}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Table */}
      <div className="table-container max-h-96">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12">#</th>
              {data.headers.map((header, index) => (
                <th key={index} className="min-w-[150px]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="font-medium text-gray-500">{rowIndex + 1}</td>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="max-w-xs truncate" title={cell}>
                    {cell || <span className="text-gray-400">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMoreRows && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          ... and {data.rows.length - 10} more rows
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="btn btn-primary flex items-center space-x-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Processing with AI...</span>
            </>
          ) : (
            <span>Confirm & Process with AI</span>
          )}
        </button>
      </div>
    </div>
  );
}
