export interface CRMRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: CRMStatus;
  crm_note?: string;
  data_source?: DataSource;
  possession_time?: string;
  description?: string;
}

export type CRMStatus = 
  | 'GOOD_LEAD_FOLLOW_UP' 
  | 'DID_NOT_CONNECT' 
  | 'BAD_LEAD' 
  | 'SALE_DONE';

export type DataSource = 
  | 'leads_on_demand' 
  | 'meridian_tower' 
  | 'eden_park' 
  | 'varah_swamy' 
  | 'sarjapur_plots'
  | '';

export interface CSVData {
  headers: string[];
  rows: string[][];
}

export interface ProcessResponse {
  records: CRMRecord[];
  skipped: SkippedRecord[];
  stats: {
    total: number;
    imported: number;
    skipped: number;
  };
}

export interface SkippedRecord {
  row: string[];
  reason: string;
  rowNumber: number;
}

export interface AIBatchRequest {
  headers: string[];
  rows: string[][];
}

export interface AIBatchResponse {
  records: CRMRecord[];
  skipped: number[];
}
