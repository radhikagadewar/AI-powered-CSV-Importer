'use client';

import { ProcessResponse, CRMRecord } from '@/types';
import { CheckCircle, XCircle, Download, ArrowLeft } from 'lucide-react';

interface ResultsTableProps {
  results: ProcessResponse;
  onReset: () => void;
}

export default function ResultsTable({ results, onReset }: ResultsTableProps) {
  const downloadCSV = () => {
    // Create CSV content
    const headers = [
      'created_at', 'name', 'email', 'country_code', 'mobile_without_country_code',
      'company', 'city', 'state', 'country', 'lead_owner', 'crm_status',
      'crm_note', 'data_source', 'possession_time', 'description'
    ];

    const rows = results.records.map(record => 
      headers.map(header => {
        const value = record[header as keyof CRMRecord] || '';
        // Escape values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groweasy-crm-import-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'GOOD_LEAD_FOLLOW_UP':
        return <span className="badge badge-success">Good Lead</span>;
      case 'DID_NOT_CONNECT':
        return <span className="badge badge-warning">Did Not Connect</span>;
      case 'BAD_LEAD':
        return <span className="badge badge-danger">Bad Lead</span>;
      case 'SALE_DONE':
        return <span className="badge badge-info">Sale Done</span>;
      default:
        return <span className="badge">—</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Import Results</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                  <p className="text-2xl font-bold">{results.stats.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Imported</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.stats.imported}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Skipped</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {results.stats.skipped}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Imported Records */}
      {results.records.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Imported Records ({results.records.length})
            </h3>
            <button
              onClick={downloadCSV}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="table-container max-h-96">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.records.map((record, index) => (
                  <tr key={index}>
                    <td className="font-medium text-gray-500">{index + 1}</td>
                    <td className="font-medium">{record.name || '—'}</td>
                    <td className="text-primary-600">{record.email || '—'}</td>
                    <td>
                      {record.country_code || record.mobile_without_country_code ? (
                        <span>
                          {record.country_code} {record.mobile_without_country_code}
                        </span>
                      ) : '—'}
                    </td>
                    <td>{record.company || '—'}</td>
                    <td>
                      {[record.city, record.state, record.country]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </td>
                    <td>{getStatusBadge(record.crm_status)}</td>
                    <td className="max-w-xs truncate" title={record.crm_note}>
                      {record.crm_note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skipped Records */}
      {results.skipped.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">
            Skipped Records ({results.skipped.length})
          </h3>

          <div className="table-container max-h-64">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-20">Row #</th>
                  <th>Data</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.skipped.map((skipped, index) => (
                  <tr key={index}>
                    <td className="font-medium text-red-600">{skipped.rowNumber}</td>
                    <td className="text-sm">
                      {skipped.row.slice(0, 3).join(', ')}
                      {skipped.row.length > 3 && '...'}
                    </td>
                    <td className="text-sm text-red-600 dark:text-red-400">
                      {skipped.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Import Another CSV</span>
        </button>
      </div>
    </div>
  );
}
