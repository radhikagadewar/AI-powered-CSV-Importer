import { CRMRecord } from '../types';

export const validateRecord = (record: CRMRecord): { valid: boolean; reason?: string } => {
  // Log the record being validated
  console.log('Validating record:', JSON.stringify(record, null, 2));
  
  // A record must have either email or mobile number
  const hasEmail = record.email && record.email.trim().length > 0;
  const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim().length > 0;

  console.log('Has email:', hasEmail, 'Has mobile:', hasMobile);

  if (!hasEmail && !hasMobile) {
    return {
      valid: false,
      reason: 'Missing both email and mobile number'
    };
  }

  // Validate email format if present
  if (hasEmail && !isValidEmail(record.email!)) {
    console.log('Invalid email format:', record.email);
    return {
      valid: false,
      reason: 'Invalid email format'
    };
  }

  // Validate date format if present
  if (record.created_at) {
    const date = new Date(record.created_at);
    if (isNaN(date.getTime())) {
      console.log('Invalid date format:', record.created_at);
      return {
        valid: false,
        reason: 'Invalid date format'
      };
    }
  }

  console.log('Record is VALID');
  return { valid: true };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeCSVValue = (value: string): string => {
  // Escape line breaks to maintain CSV integrity
  return value.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
};

export const isValidCRMStatus = (status: string): boolean => {
  const validStatuses = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
  return validStatuses.includes(status);
};

export const isValidDataSource = (source: string): boolean => {
  const validSources = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots', ''];
  return validSources.includes(source);
};
