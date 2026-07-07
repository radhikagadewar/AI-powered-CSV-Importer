# Testing Guide

This document provides instructions for testing the AI-powered CSV Importer.

## Prerequisites

Before testing, ensure you have:
1. Node.js 18+ installed
2. OpenAI API key configured in `backend/.env`
3. Both frontend and backend servers running

## Starting the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend will start on http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on http://localhost:3000

## Test Scenarios

### 1. Basic Upload Test

**Objective**: Verify CSV upload and parsing works correctly

**Steps**:
1. Open http://localhost:3000
2. Click or drag `sample-csvs/facebook-leads.csv`
3. Verify preview table shows correctly:
   - Headers are displayed
   - Data rows are visible
   - Row count is accurate
4. Click "Cancel" to return to upload

**Expected Result**: CSV preview displays without errors

### 2. Field Mapping Test

**Objective**: Verify AI correctly maps different column names

**Test Cases**:

#### Test 2a: Facebook Leads Format
- File: `facebook-leads.csv`
- Columns: Full Name, Email Address, Phone Number, etc.
- Expected: AI maps to name, email, mobile_without_country_code

#### Test 2b: Google Ads Format
- File: `google-ads.csv`
- Columns: Lead Date, Name, Contact Email, Mobile, etc.
- Expected: AI maps Lead Date to created_at, Contact Email to email

#### Test 2c: Real Estate Format
- File: `real-estate.csv`
- Columns: Client Name, Primary Email, Phone 1, Property Interest, etc.
- Expected: AI extracts data_source from Property Interest field

**Steps for each**:
1. Upload CSV file
2. Review preview
3. Click "Confirm & Process with AI"
4. Wait for processing
5. Review extracted records

**Expected Results**:
- All valid records are imported
- Fields are correctly mapped
- CRM status is intelligently assigned
- Multiple emails/phones consolidated in crm_note

### 3. CRM Status Mapping Test

**Objective**: Verify AI maps status terms correctly

**Test Data** (from sample CSVs):
- "Interested" → GOOD_LEAD_FOLLOW_UP
- "Not Reachable" → DID_NOT_CONNECT
- "Not Interested" → BAD_LEAD
- "Deal Closed" → SALE_DONE

**Steps**:
1. Upload `facebook-leads.csv`
2. Process with AI
3. Check status badges in results

**Expected Result**: Each status is correctly classified

### 4. Data Source Mapping Test

**Objective**: Verify AI recognizes property/source names

**Test Data** (from real-estate.csv):
- "Meridian Tower" → meridian_tower
- "Eden Park" → eden_park
- "Varah Swamy" → varah_swamy
- "Sarjapur Plots" → sarjapur_plots

**Steps**:
1. Upload `real-estate.csv`
2. Process with AI
3. Check data_source field in results

**Expected Result**: Property names correctly mapped to data_source values

### 5. Validation Test

**Objective**: Verify records without email/mobile are skipped

**Test Data** (mixed-format.csv has an invalid record):
- Row 3: Has email but no name or phone → Should be skipped

**Steps**:
1. Upload `mixed-format.csv`
2. Process with AI
3. Check "Skipped Records" section

**Expected Result**: 
- Invalid record appears in skipped section
- Reason: "Missing both email and mobile number"

### 6. Multiple Contact Consolidation Test

**Objective**: Verify extra emails/phones go to crm_note

**Test Data** (real-estate.csv):
- Emma Thompson has Secondary Email and Phone 2

**Steps**:
1. Upload `real-estate.csv`
2. Process with AI
3. Check Emma Thompson's record
4. Expand crm_note field

**Expected Result**: 
- Primary email/phone in respective fields
- Secondary contacts in crm_note

### 7. Date Format Test

**Objective**: Verify dates are properly formatted

**Test Data**:
- Google Ads: "2026-05-13"
- Mixed Format: "2026-05-10 09:30:00"

**Steps**:
1. Upload files with dates
2. Process with AI
3. Check created_at field format

**Expected Result**: Dates are valid JavaScript Date strings (ISO 8601)

### 8. Large File Test

**Objective**: Test batch processing with many rows

**Steps**:
1. Create a CSV with 100+ rows (duplicate sample data)
2. Upload the file
3. Watch progress during processing
4. Verify all records processed

**Expected Result**: 
- Processing completes successfully
- All batches processed
- Stats show correct counts

### 9. CSV Download Test

**Objective**: Verify exported CSV is valid

**Steps**:
1. Process any CSV file
2. Click "Download CSV" button
3. Open downloaded file in Excel/Sheets

**Expected Result**:
- File opens correctly
- All GrowEasy CRM fields present
- Data is properly formatted
- No line break issues

### 10. Dark Mode Test

**Objective**: Verify UI works in dark mode

**Steps**:
1. Click moon icon (top right)
2. Navigate through upload → preview → results
3. Toggle back to light mode

**Expected Result**: 
- All components display correctly
- Text is readable
- Colors are appropriate

### 11. Responsive Design Test

**Objective**: Verify mobile/tablet layouts

**Steps**:
1. Open browser dev tools
2. Toggle device toolbar
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Expected Result**:
- Tables scroll horizontally on small screens
- Buttons remain accessible
- Stats cards stack on mobile
- No layout breaking

### 12. Error Handling Test

**Objective**: Verify error messages display correctly

**Test Cases**:

#### Test 12a: Invalid File Type
- Upload a .txt or .xlsx file
- Expected: "Only CSV files are allowed"

#### Test 12b: Empty CSV
- Upload CSV with only headers
- Expected: "CSV must have at least one data row"

#### Test 12c: Invalid API Key
- Set wrong OPENAI_API_KEY
- Upload and process CSV
- Expected: Clear error message

#### Test 12d: Network Error
- Stop backend server
- Try uploading CSV
- Expected: Connection error message

### 13. Edge Cases

**Test Data**:
- CSV with special characters in cells
- CSV with commas in values
- CSV with very long text fields
- CSV with missing columns
- CSV with extra empty rows

**Steps**: Upload each and verify handling

**Expected Result**: App handles gracefully without crashing

## Performance Benchmarks

### Expected Processing Times

| Rows | Expected Time | Acceptable Range |
|------|---------------|------------------|
| 10   | 2-5 seconds   | < 10 seconds    |
| 50   | 10-20 seconds | < 30 seconds    |
| 100  | 20-40 seconds | < 60 seconds    |
| 500  | 2-5 minutes   | < 10 minutes    |

*Note: Times depend on OpenAI API response time*

## API Testing with cURL

### Upload CSV
```bash
curl -X POST http://localhost:3001/api/csv/upload \
  -F "file=@sample-csvs/facebook-leads.csv"
```

### Process CSV
```bash
curl -X POST http://localhost:3001/api/csv/process \
  -H "Content-Type: application/json" \
  -d '{
    "headers": ["Name", "Email"],
    "rows": [["John", "john@example.com"]]
  }'
```

### Health Check
```bash
curl http://localhost:3001/api/csv/health
```

## Troubleshooting

### Backend Issues

**Problem**: "OPENAI_API_KEY is not configured"
- **Solution**: Create `backend/.env` with valid API key

**Problem**: Port 3001 already in use
- **Solution**: Change PORT in .env or kill existing process

### Frontend Issues

**Problem**: "Failed to fetch"
- **Solution**: Ensure backend is running and NEXT_PUBLIC_API_URL is correct

**Problem**: Build errors
- **Solution**: Delete `.next` folder and `node_modules`, reinstall

### AI Processing Issues

**Problem**: Incorrect field mapping
- **Solution**: AI prompt may need tuning in `ai.service.ts`

**Problem**: Slow processing
- **Solution**: Reduce batch size or upgrade to GPT-4

## Automated Testing

### Backend Unit Tests (Future)
```bash
cd backend
npm test
```

### Frontend Component Tests (Future)
```bash
cd frontend
npm test
```

## Reporting Issues

When reporting bugs, please include:
1. Steps to reproduce
2. Expected vs actual behavior
3. CSV file (if applicable)
4. Browser/Node version
5. Error messages/screenshots

## Success Criteria

A successful test should demonstrate:
- ✅ CSV upload works for various formats
- ✅ AI correctly maps 90%+ of fields
- ✅ Invalid records are properly skipped
- ✅ CRM status mapping is accurate
- ✅ Multiple contacts consolidated correctly
- ✅ Download produces valid CSV
- ✅ UI is responsive and accessible
- ✅ Error handling is graceful
- ✅ Dark mode works properly
- ✅ Performance is acceptable

## Next Steps

After testing, consider:
1. Deploying to production (Vercel/Railway)
2. Adding more sample CSVs
3. Implementing unit tests
4. Setting up CI/CD pipeline
5. Adding user authentication
6. Implementing database storage
7. Adding export to CRM features
