import { parse } from 'csv-parse/sync';
import { CSVData } from '../types';

export class CSVService {
  /**
   * Parse CSV file buffer into structured data
   */
  parseCSV(buffer: Buffer): CSVData {
    try {
      const records = parse(buffer, {
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true,
      });

      if (!records || records.length === 0) {
        throw new Error('CSV file is empty');
      }

      // First row is headers
      const headers = records[0].map((h: string) => h.trim());
      
      // Rest are data rows
      const rows = records.slice(1).map((row: string[]) => 
        row.map((cell: string) => cell?.toString().trim() || '')
      );

      return {
        headers,
        rows,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse CSV: ${error.message}`);
      }
      throw new Error('Failed to parse CSV file');
    }
  }

  /**
   * Validate CSV structure
   */
  validateCSV(data: CSVData): { valid: boolean; error?: string } {
    if (!data.headers || data.headers.length === 0) {
      return { valid: false, error: 'CSV must have headers' };
    }

    if (!data.rows || data.rows.length === 0) {
      return { valid: false, error: 'CSV must have at least one data row' };
    }

    // Check if all rows have consistent column count
    const headerCount = data.headers.length;
    const inconsistentRows = data.rows.filter(row => row.length !== headerCount);
    
    if (inconsistentRows.length > 0) {
      console.warn(`Warning: ${inconsistentRows.length} rows have inconsistent column counts`);
      // Don't fail, just warn - we'll handle this gracefully
    }

    return { valid: true };
  }

  /**
   * Get preview of CSV data (first N rows)
   */
  getPreview(data: CSVData, maxRows: number = 10): CSVData {
    return {
      headers: data.headers,
      rows: data.rows.slice(0, maxRows),
    };
  }

  /**
   * Split data into batches for processing
   */
  createBatches(data: CSVData, batchSize: number = 10): CSVData[] {
    const batches: CSVData[] = [];
    
    for (let i = 0; i < data.rows.length; i += batchSize) {
      batches.push({
        headers: data.headers,
        rows: data.rows.slice(i, i + batchSize),
      });
    }

    return batches;
  }
}

export default new CSVService();
