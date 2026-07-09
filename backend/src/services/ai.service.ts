import OpenAI from 'openai';
import dotenv from 'dotenv';
import { CRMRecord, CSVData, AIBatchResponse } from '../types';
import { validateRecord, sanitizeCSVValue } from '../utils/validation';

// Load environment variables
dotenv.config();

export class AIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Create the AI prompt for extracting CRM records
   */
  private createPrompt(headers: string[], rows: string[][]): string {
    const csvSample = this.formatCSVForPrompt(headers, rows);

    return `You are a data extraction expert. Extract CRM lead information from the CSV data below and convert it to the GrowEasy CRM format.

CSV Headers: ${headers.join(', ')}

CSV Data:
${csvSample}

CRITICAL RULES:
1. Extract as many of these fields as possible: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description

2. CRM Status - ONLY use one of these values:
   - GOOD_LEAD_FOLLOW_UP
   - DID_NOT_CONNECT
   - BAD_LEAD
   - SALE_DONE
   Map similar terms intelligently (e.g., "interested" → GOOD_LEAD_FOLLOW_UP, "not reachable" → DID_NOT_CONNECT)

3. Data Source - ONLY use one of these values if you can confidently match:
   - leads_on_demand
   - meridian_tower
   - eden_park
   - varah_swamy
   - sarjapur_plots
   Leave empty if uncertain.

4. Date Format: created_at must be valid JavaScript Date string (ISO 8601 preferred, e.g., "2026-05-13T14:20:48Z" or "2026-05-13 14:20:48")

5. Multiple Emails/Phones:
   - Use the FIRST email as "email"
   - Use the FIRST mobile as "mobile_without_country_code"
   - Put additional emails/phones in "crm_note"

6. CRM Notes: Consolidate these into crm_note:
   - Remarks, comments, follow-up notes
   - Extra emails and phone numbers
   - Any useful information that doesn't fit other fields

7. Phone Number Parsing:
   - Extract country_code (e.g., "+91", "+1")
   - Extract mobile_without_country_code (the number without country code)
   - If no country code present, leave country_code empty

8. CSV Integrity:
   - Escape line breaks as \\n (not actual newlines)
   - Each record must remain a single CSV row
   - Do not introduce unescaped line breaks

9. Skip Records that have NEITHER email NOR mobile number

10. Intelligent Mapping:
    - Map column names flexibly (e.g., "Full Name" → name, "Phone" → mobile_without_country_code)
    - Use context clues to identify fields
    - Be smart about similar field names

Return a JSON object with this EXACT structure:
{
  "records": [
    {
      "created_at": "2026-05-13T14:20:48Z",
      "name": "John Doe",
      "email": "john@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "company": "GrowEasy",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "test@gmail.com",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Extra contact: alt@example.com",
      "data_source": "",
      "possession_time": "",
      "description": ""
    }
  ],
  "skipped": [2, 5]
}

The "skipped" array contains row indices (0-based) of records that should be skipped (missing both email and mobile).
Include ALL fields in each record, use empty string "" for missing values.
Return valid JSON only, no markdown formatting.`;
  }

  private formatCSVForPrompt(headers: string[], rows: string[][]): string {
    const lines = [headers.join(',')];
    rows.forEach(row => {
      lines.push(row.join(','));
    });
    return lines.join('\n');
  }

  /**
   * Process a batch of CSV rows through AI
   */
  async processBatch(data: CSVData): Promise<AIBatchResponse> {
    try {
      const prompt = this.createPrompt(data.headers, data.rows);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can upgrade to gpt-4o for better accuracy
        messages: [
          {
            role: 'system',
            content: 'You are a data extraction expert specializing in CRM data mapping. Always return valid JSON responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const result = JSON.parse(content) as AIBatchResponse;

      // Debug: Log what AI returned
      console.log('AI Response:', JSON.stringify(result, null, 2));

      // Validate and sanitize records
      const validatedRecords = result.records
        .map(record => this.sanitizeRecord(record))
        .filter(record => {
          const validation = validateRecord(record);
          if (!validation.valid) {
            console.log('Validation failed for record:', record, 'Reason:', validation.reason);
          }
          return validation.valid;
        });

      console.log('Validated records count:', validatedRecords.length);

      return {
        records: validatedRecords,
        skipped: result.skipped || []
      };

    } catch (error) {
      console.error('AI processing error:', error);
      if (error instanceof Error) {
        throw new Error(`AI extraction failed: ${error.message}`);
      }
      throw new Error('AI extraction failed');
    }
  }

  /**
   * Sanitize a single record
   */
  private sanitizeRecord(record: CRMRecord): CRMRecord {
    const sanitized: any = {}; // Change to any to avoid type errors

    // Sanitize all string fields
    Object.keys(record).forEach(key => {
      const value = (record as any)[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeCSVValue(value.trim());
      } else if (value !== undefined && value !== null) {
        sanitized[key] = value;
      }
    });

    // Ensure date is valid
    if (sanitized.created_at) {
      const date = new Date(sanitized.created_at);
      if (!isNaN(date.getTime())) {
        sanitized.created_at = date.toISOString();
      } else {
        delete sanitized.created_at;
      }
    }

    return sanitized;
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

    // Process each batch
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchOffset = batchIndex * batchSize;

      try {
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

export default new AIService();
