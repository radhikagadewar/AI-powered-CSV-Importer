import { CRMRecord, CSVData, AIBatchResponse } from '../types';
import { validateRecord, sanitizeCSVValue } from '../utils/validation';

/**
 * Demo AI Service - Rule-based extraction without OpenAI API
 * This simulates AI extraction for testing without API credits
 */
export class DemoAIService {
  
  /**
   * Process a batch of CSV rows using rule-based extraction
   */
  async processBatch(data: CSVData): Promise<AIBatchResponse> {
    console.log('🎭 Demo Mode: Processing batch without OpenAI API');
    
    const records: CRMRecord[] = [];
    const skipped: number[] = [];

    data.rows.forEach((row, index) => {
      try {
        const record = this.extractRecord(data.headers, row);
        
        // Validate the record
        const validation = validateRecord(record);
        if (validation.valid) {
          records.push(record);
        } else {
          console.log(`Skipping row ${index + 1}: ${validation.reason}`);
          skipped.push(index);
        }
      } catch (error) {
        console.log(`Error processing row ${index + 1}:`, error);
        skipped.push(index);
      }
    });

    console.log(`✅ Demo Mode: Extracted ${records.length} records, skipped ${skipped.length}`);

    return {
      records,
      skipped
    };
  }

  /**
   * Extract a single record using intelligent field mapping
   */
  private extractRecord(headers: string[], row: string[]): CRMRecord {
    const record: CRMRecord = {};

    headers.forEach((header, index) => {
      const value = row[index]?.trim() || '';
      if (!value) return;

      const lowerHeader = header.toLowerCase();

      // Name mapping
      if (this.matchesField(lowerHeader, ['name', 'full name', 'person_name', 'client name', 'lead name'])) {
        record.name = value;
      }
      
      // Email mapping
      else if (this.matchesField(lowerHeader, ['email', 'email address', 'email_id', 'contact email', 'primary email'])) {
        record.email = value;
      }
      
      // Phone/Mobile mapping
      else if (this.matchesField(lowerHeader, ['phone', 'mobile', 'phone number', 'phone_no', 'contact number', 'cell', 'telephone'])) {
        const phoneData = this.parsePhone(value);
        record.country_code = phoneData.countryCode;
        record.mobile_without_country_code = phoneData.number;
      }
      
      // Company mapping
      else if (this.matchesField(lowerHeader, ['company', 'company name', 'business', 'organization', 'firm'])) {
        record.company = value;
      }
      
      // City mapping
      else if (this.matchesField(lowerHeader, ['city', 'city_name', 'location'])) {
        record.city = value;
      }
      
      // State mapping
      else if (this.matchesField(lowerHeader, ['state', 'state_name', 'province'])) {
        record.state = value;
      }
      
      // Country mapping
      else if (this.matchesField(lowerHeader, ['country', 'country_name', 'nation'])) {
        record.country = value;
      }
      
      // Status mapping
      else if (this.matchesField(lowerHeader, ['status', 'lead status', 'lead_type', 'crm_status'])) {
        record.crm_status = this.mapStatus(value);
      }
      
      // Notes/Comments mapping
      else if (this.matchesField(lowerHeader, ['notes', 'comments', 'remarks', 'description', 'note', 'comment'])) {
        record.crm_note = record.crm_note 
          ? `${record.crm_note}; ${value}` 
          : value;
      }
      
      // Lead owner mapping
      else if (this.matchesField(lowerHeader, ['owner', 'lead owner', 'sales rep', 'assigned to'])) {
        record.lead_owner = value;
      }
      
      // Date mapping
      else if (this.matchesField(lowerHeader, ['date', 'created', 'created_at', 'created_date', 'lead date'])) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            record.created_at = date.toISOString();
          }
        } catch (e) {
          // Invalid date, skip
        }
      }
      
      // Data source mapping
      else if (this.matchesField(lowerHeader, ['source', 'data_source', 'campaign', 'property'])) {
        record.data_source = this.mapDataSource(value);
      }
    });

    // Set defaults for missing fields
    record.data_source = record.data_source || '';
    record.possession_time = record.possession_time || '';
    record.description = record.description || '';
    record.crm_note = record.crm_note || '';
    
    // Set default date if missing
    if (!record.created_at) {
      record.created_at = new Date().toISOString();
    }

    return record;
  }

  /**
   * Check if header matches any of the field patterns
   */
  private matchesField(header: string, patterns: string[]): boolean {
    return patterns.some(pattern => 
      header.includes(pattern) || pattern.includes(header)
    );
  }

  /**
   * Parse phone number to extract country code
   */
  private parsePhone(phone: string): { countryCode: string; number: string } {
    // Remove spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if starts with +
    if (cleaned.startsWith('+')) {
      // Extract country code (assume 1-3 digits after +)
      const match = cleaned.match(/^\+(\d{1,3})(\d+)$/);
      if (match) {
        return {
          countryCode: `+${match[1]}`,
          number: match[2]
        };
      }
    }
    
    // No country code found
    return {
      countryCode: '',
      number: cleaned.replace(/^\+/, '')
    };
  }

  /**
   * Map status text to CRM status values
   */
  private mapStatus(status: string): CRMRecord['crm_status'] {
    const lower = status.toLowerCase();
    
    if (lower.includes('interested') || lower.includes('good') || lower.includes('follow')) {
      return 'GOOD_LEAD_FOLLOW_UP';
    }
    if (lower.includes('not reachable') || lower.includes('did not connect') || lower.includes('no response')) {
      return 'DID_NOT_CONNECT';
    }
    if (lower.includes('not interested') || lower.includes('bad') || lower.includes('rejected')) {
      return 'BAD_LEAD';
    }
    if (lower.includes('closed') || lower.includes('done') || lower.includes('sale') || lower.includes('signed')) {
      return 'SALE_DONE';
    }
    
    // Default to follow up
    return 'GOOD_LEAD_FOLLOW_UP';
  }

  /**
   * Map data source text to allowed values
   */
  private mapDataSource(source: string): CRMRecord['data_source'] {
    const lower = source.toLowerCase();
    
    if (lower.includes('meridian') || lower.includes('tower')) return 'meridian_tower';
    if (lower.includes('eden') || lower.includes('park')) return 'eden_park';
    if (lower.includes('varah') || lower.includes('swamy')) return 'varah_swamy';
    if (lower.includes('sarjapur') || lower.includes('plot')) return 'sarjapur_plots';
    if (lower.includes('leads on demand')) return 'leads_on_demand';
    
    return '';
  }

  /**
   * Process large CSV in batches with progress tracking
   */
  async processInBatches(
    data: CSVData, 
    batchSize: number = 10,
    onProgress?: (processed: number, total: number) => void
  ): Promise<{ records: CRMRecord[]; skipped: number[] }> {
    const allRecords: CRMRecord[] = [];
    const allSkipped: number[] = [];
    let processedRows = 0;

    // Split into batches
    const batches: CSVData[] = [];
    for (let i = 0; i < data.rows.length; i += batchSize) {
      batches.push({
        headers: data.headers,
        rows: data.rows.slice(i, i + batchSize)
      });
    }

    console.log(`🎭 Demo Mode: Processing ${batches.length} batches`);

    // Process each batch
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchOffset = batchIndex * batchSize;

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await this.processBatch(batch);
        
        allRecords.push(...result.records);
        
        // Adjust skipped indices to global row numbers
        const adjustedSkipped = result.skipped.map(idx => idx + batchOffset);
        allSkipped.push(...adjustedSkipped);

        processedRows += batch.rows.length;
        
        if (onProgress) {
          onProgress(processedRows, data.rows.length);
        }

      } catch (error) {
        console.error(`Batch ${batchIndex + 1} failed:`, error);
        // Mark all rows in failed batch as skipped
        for (let i = 0; i < batch.rows.length; i++) {
          allSkipped.push(batchOffset + i);
        }
      }
    }

    return {
      records: allRecords,
      skipped: allSkipped
    };
  }
}

export default new DemoAIService();
