'use client';

import { useState } from 'react';
import { CSVData, ProcessResponse, APIResponse } from '@/types';
import CSVUploader from '@/components/CSVUploader';
import CSVPreview from '@/components/CSVPreview';
import ResultsTable from '@/components/ResultsTable';
import ThemeToggle from '@/components/ThemeToggle';
import { FileSpreadsheet, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Step = 'upload' | 'preview' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [results, setResults] = useState<ProcessResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/csv/upload`, {
        method: 'POST',
        body: formData,
      });

      const data: APIResponse<CSVData> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to upload CSV');
      }

      setCSVData(data.data);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!csvData) return;

    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_URL}/api/csv/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(csvData),
      });

      const data: APIResponse<ProcessResponse> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to process CSV');
      }

      setResults(data.data);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCSVData(null);
    setStep('upload');
  };

  const handleReset = () => {
    setCSVData(null);
    setResults(null);
    setError(null);
    setStep('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">GrowEasy CSV Importer</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered CRM lead extraction
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <StepIndicator number={1} label="Upload" active={step === 'upload'} completed={step !== 'upload'} />
              <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600" />
              <StepIndicator number={2} label="Preview" active={step === 'preview'} completed={step === 'results'} />
              <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600" />
              <StepIndicator number={3} label="Results" active={step === 'results'} completed={false} />
            </div>
          </div>

          {/* Content */}
          {step === 'upload' && (
            <CSVUploader onFileSelect={handleFileSelect} isUploading={isUploading} />
          )}

          {step === 'preview' && csvData && (
            <CSVPreview
              data={csvData}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              isProcessing={isProcessing}
            />
          )}

          {step === 'results' && results && (
            <ResultsTable results={results} onReset={handleReset} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, Express, and OpenAI</p>
          <p className="mt-1">
            Supports any CSV format • Intelligent field mapping • Real-time processing
          </p>
        </footer>
      </main>
    </div>
  );
}

interface StepIndicatorProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
          ${completed 
            ? 'bg-green-500 text-white' 
            : active 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }
        `}
      >
        {completed ? '✓' : number}
      </div>
      <span
        className={`
          mt-2 text-xs font-medium
          ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}
        `}
      >
        {label}
      </span>
    </div>
  );
}
