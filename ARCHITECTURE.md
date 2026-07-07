# Architecture Documentation

## System Overview

The AI-Powered CSV Importer is a full-stack web application that uses artificial intelligence to intelligently extract and map CRM lead information from any CSV format. The system consists of a React/Next.js frontend and a Node.js/Express backend, with OpenAI providing the AI extraction capabilities.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Next.js Frontend (Port 3000)              │   │
│  │  • File Upload UI                                    │   │
│  │  • CSV Preview Table                                 │   │
│  │  • Results Display                                   │   │
│  │  • Dark Mode Theme                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Express Backend (Port 3001)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Layer                                             │  │
│  │  • File Upload Endpoint                               │  │
│  │  • CSV Processing Endpoint                            │  │
│  │  • Health Check                                       │  │
│  └───────────────┬──────────────────────────────────────┘  │
│                  │                                           │
│  ┌───────────────▼──────────────────────────────────────┐  │
│  │ Service Layer                                         │  │
│  │  ┌─────────────────┐    ┌──────────────────────┐    │  │
│  │  │  CSV Service    │    │   AI Service          │    │  │
│  │  │  • Parse CSV    │    │   • Batch Processing  │    │  │
│  │  │  • Validate     │    │   • Prompt Engineering│    │  │
│  │  │  • Create Batch │    │   • Record Extraction │    │  │
│  │  └─────────────────┘    └───────────┬──────────┘    │  │
│  └────────────────────────────────────────┼─────────────┘  │
└────────────────────────────────────────────┼────────────────┘
                                             │
                                             │ API Call
                                             │
┌────────────────────────────────────────────▼────────────────┐
│                    OpenAI API                                │
│  • GPT-4o-mini Model                                         │
│  • Structured JSON Output                                    │
│  • Intelligent Field Mapping                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **State Management**: React Hooks (useState)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **CSV Parsing**: csv-parse
- **File Upload**: Multer
- **AI Integration**: OpenAI SDK
- **Validation**: Zod (optional)

### Infrastructure
- **Development**: Local (Node + Next dev servers)
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)
- **Containerization**: Docker + Docker Compose

---

## Directory Structure

```
csv-importer/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── page.tsx     # Main page component
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── globals.css  # Global styles
│   │   ├── components/      # React Components
│   │   │   ├── CSVUploader.tsx      # Drag & drop upload
│   │   │   ├── CSVPreview.tsx       # Preview table
│   │   │   ├── ResultsTable.tsx     # Results display
│   │   │   └── ThemeToggle.tsx      # Dark mode toggle
│   │   └── types/           # TypeScript type definitions
│   │       └── index.ts
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                 # Express Backend Application
│   ├── src/
│   │   ├── index.ts         # Express server entry point
│   │   ├── routes/          # API route handlers
│   │   │   └── csv.routes.ts
│   │   ├── services/        # Business logic
│   │   │   ├── csv.service.ts    # CSV parsing logic
│   │   │   └── ai.service.ts     # AI extraction logic
│   │   ├── utils/           # Helper functions
│   │   │   └── validation.ts
│   │   └── types/           # TypeScript type definitions
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── sample-csvs/             # Test CSV files
│   ├── facebook-leads.csv
│   ├── google-ads.csv
│   ├── real-estate.csv
│   └── mixed-format.csv
│
├── docker-compose.yml       # Docker orchestration
├── .gitignore
├── README.md
├── TESTING.md
├── DEPLOYMENT.md
└── ARCHITECTURE.md (this file)
```

---

## Data Flow

### 1. File Upload Flow

```
User
  │
  ├─> Drag & Drop or Click to Select CSV
  │
  ▼
CSVUploader Component
  │
  ├─> Creates FormData
  ├─> POST /api/csv/upload
  │
  ▼
Backend: csv.routes.ts
  │
  ├─> Multer Middleware (memory storage)
  ├─> Validate file type (.csv)
  ├─> Check file size (<10MB)
  │
  ▼
Backend: csv.service.ts
  │
  ├─> Parse CSV Buffer
  ├─> Extract Headers
  ├─> Extract Rows
  ├─> Validate Structure
  │
  ▼
Response to Frontend
  │
  ├─> { headers: [], rows: [], totalRows: N }
  │
  ▼
CSVPreview Component
  │
  └─> Display Table
```

### 2. AI Processing Flow

```
User Clicks "Confirm & Process"
  │
  ▼
Frontend: page.tsx
  │
  ├─> POST /api/csv/process
  ├─> Body: { headers: [], rows: [] }
  │
  ▼
Backend: csv.routes.ts
  │
  ├─> Validate CSV Data
  │
  ▼
Backend: ai.service.ts
  │
  ├─> Split into Batches (10 rows each)
  │
  ▼
For Each Batch:
  │
  ├─> Build AI Prompt
  ├─> Call OpenAI API (GPT-4o-mini)
  ├─> Parse JSON Response
  ├─> Validate Records
  ├─> Sanitize Data
  │
  ▼
Aggregate Results
  │
  ├─> Combine all records
  ├─> Combine all skipped indices
  ├─> Calculate stats
  │
  ▼
Response to Frontend
  │
  ├─> { records: [], skipped: [], stats: {} }
  │
  ▼
ResultsTable Component
  │
  └─> Display Results
```

---

## Component Architecture

### Frontend Components

#### Page Component (`page.tsx`)
- **Purpose**: Main orchestrator component
- **State Management**: 
  - `step`: Current workflow step (upload | preview | results)
  - `csvData`: Parsed CSV data
  - `results`: AI processing results
  - `error`: Error messages
  - `isUploading/isProcessing`: Loading states
- **Responsibilities**:
  - Coordinate workflow steps
  - Handle API calls
  - Error handling
  - State management

#### CSVUploader Component
- **Purpose**: File upload interface
- **Features**:
  - Drag & drop support
  - File picker fallback
  - File type validation
  - Loading state
- **Props**:
  - `onFileSelect`: Callback for file selection
  - `isUploading`: Loading state

#### CSVPreview Component
- **Purpose**: Display CSV data before processing
- **Features**:
  - Sticky header table
  - Horizontal/vertical scrolling
  - Row numbering
  - Preview limit (first 10 rows)
  - Confirm/Cancel actions
- **Props**:
  - `data`: CSV data
  - `onConfirm`: Process confirmation
  - `onCancel`: Cancel action
  - `isProcessing`: Loading state

#### ResultsTable Component
- **Purpose**: Display AI extraction results
- **Features**:
  - Stats cards (total, imported, skipped)
  - Imported records table
  - Skipped records table
  - CSV download functionality
  - Status badges
  - Reset action
- **Props**:
  - `results`: Processing results
  - `onReset`: Reset workflow

#### ThemeToggle Component
- **Purpose**: Dark mode toggle
- **Features**:
  - localStorage persistence
  - Smooth transitions
  - Icon swap (sun/moon)

### Backend Services

#### CSV Service (`csv.service.ts`)
- **Methods**:
  - `parseCSV(buffer)`: Parse CSV buffer to structured data
  - `validateCSV(data)`: Validate CSV structure
  - `getPreview(data, maxRows)`: Get preview subset
  - `createBatches(data, batchSize)`: Split into batches
- **Responsibilities**:
  - CSV parsing
  - Data validation
  - Batch preparation

#### AI Service (`ai.service.ts`)
- **Methods**:
  - `createPrompt(headers, rows)`: Build AI prompt
  - `processBatch(data)`: Process single batch
  - `processInBatches(data, batchSize, onProgress)`: Process all batches
  - `sanitizeRecord(record)`: Clean and validate record
- **Responsibilities**:
  - AI prompt engineering
  - OpenAI API communication
  - Batch processing
  - Data sanitization
  - Error handling

---

## AI Prompt Engineering

### Prompt Strategy

The AI prompt is carefully engineered to:

1. **Provide Context**: Explain the task and CRM format
2. **Define Rules**: Specify exact requirements and constraints
3. **Show Examples**: Include sample output format
4. **Handle Edge Cases**: Account for multiple formats and missing data
5. **Ensure Consistency**: Use low temperature (0.1) for deterministic output

### Key Prompt Components

```
1. Task Description
   └─> "Extract CRM lead information from CSV..."

2. CSV Data
   └─> Headers + Rows formatted as CSV

3. Critical Rules
   ├─> Field extraction guidelines
   ├─> CRM Status mapping
   ├─> Data Source mapping
   ├─> Date formatting
   ├─> Multiple contacts handling
   ├─> CSV integrity requirements
   ├─> Validation rules
   └─> Intelligent mapping instructions

4. Output Format
   └─> JSON structure with examples

5. Return Format
   └─> { records: [...], skipped: [...] }
```

### Intelligent Field Mapping

The AI uses semantic understanding to map various column names:

| Source Columns | Target Field | Examples |
|----------------|--------------|----------|
| "Full Name", "Name", "Client Name" | `name` | Various naming conventions |
| "Email", "Contact Email", "Primary Email" | `email` | Different email labels |
| "Phone", "Mobile", "Contact Number" | `mobile_without_country_code` | Phone variations |
| "Interested", "Good Lead" | `crm_status: GOOD_LEAD_FOLLOW_UP` | Status inference |
| "Not Reachable", "Did Not Answer" | `crm_status: DID_NOT_CONNECT` | Connection issues |
| "Meridian Tower", "Eden Park" | `data_source` | Property names |

---

## API Endpoints

### POST `/api/csv/upload`

**Purpose**: Upload and parse CSV file

**Request**:
```http
POST /api/csv/upload
Content-Type: multipart/form-data

file: <CSV file>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "headers": ["Name", "Email", "Phone"],
    "rows": [
      ["John Doe", "john@example.com", "1234567890"]
    ],
    "totalRows": 1
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Only CSV files are allowed"
}
```

### POST `/api/csv/process`

**Purpose**: Process CSV with AI extraction

**Request**:
```http
POST /api/csv/process
Content-Type: application/json

{
  "headers": ["Name", "Email", "Phone"],
  "rows": [
    ["John Doe", "john@example.com", "1234567890"]
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile_without_country_code": "1234567890",
        "crm_status": "GOOD_LEAD_FOLLOW_UP",
        ...
      }
    ],
    "skipped": [
      {
        "row": ["...", "..."],
        "reason": "Missing both email and mobile",
        "rowNumber": 3
      }
    ],
    "stats": {
      "total": 100,
      "imported": 95,
      "skipped": 5
    }
  }
}
```

### GET `/api/csv/health`

**Purpose**: Health check

**Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-13T10:00:00.000Z"
}
```

---

## Data Models

### TypeScript Interfaces

```typescript
// CRM Record - Main data structure
interface CRMRecord {
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

// Enums
type CRMStatus = 
  | 'GOOD_LEAD_FOLLOW_UP' 
  | 'DID_NOT_CONNECT' 
  | 'BAD_LEAD' 
  | 'SALE_DONE';

type DataSource = 
  | 'leads_on_demand' 
  | 'meridian_tower' 
  | 'eden_park' 
  | 'varah_swamy' 
  | 'sarjapur_plots'
  | '';

// CSV Data structure
interface CSVData {
  headers: string[];
  rows: string[][];
  totalRows?: number;
}

// Processing response
interface ProcessResponse {
  records: CRMRecord[];
  skipped: SkippedRecord[];
  stats: {
    total: number;
    imported: number;
    skipped: number;
  };
}

// Skipped record info
interface SkippedRecord {
  row: string[];
  reason: string;
  rowNumber: number;
}
```

---

## Security Considerations

### Input Validation
- File type validation (CSV only)
- File size limit (10MB)
- CSV structure validation
- Record validation before storage

### Data Sanitization
- Escape line breaks in CSV values
- Validate email format
- Validate date format
- Sanitize all string inputs

### API Security
- CORS configuration
- Rate limiting (recommended for production)
- API key protection (environment variables)
- Input sanitization

### Environment Variables
- Never commit `.env` files
- Use separate keys for dev/prod
- Rotate API keys regularly

---

## Performance Optimization

### Frontend
- Next.js automatic code splitting
- React component memoization where needed
- Lazy loading for large tables (future: virtual scrolling)
- Optimized image assets
- Tailwind CSS purging

### Backend
- Batch processing (10 rows per batch)
- Streaming responses for large files (bonus feature)
- Memory-efficient CSV parsing
- Response compression (can be added)

### AI Processing
- Batch size optimization (balance between speed and API limits)
- Low temperature for consistent results
- Efficient prompt design
- Error retry mechanism (can be added)

---

## Error Handling

### Frontend
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states during operations
- Error state reset on retry

### Backend
- Comprehensive try-catch blocks
- Detailed error logging
- Graceful degradation
- HTTP status codes
- Error response format consistency

### AI Processing
- Batch failure handling
- Invalid JSON parsing fallback
- OpenAI API error handling
- Validation error handling

---

## Testing Strategy

### Frontend Testing (Future Implementation)
- Component unit tests (Jest + React Testing Library)
- Integration tests (file upload flow)
- E2E tests (Playwright/Cypress)
- Visual regression tests

### Backend Testing (Future Implementation)
- Unit tests (Jest)
- API endpoint tests (Supertest)
- CSV parsing tests
- AI service mocking tests
- Integration tests

### Manual Testing
- See TESTING.md for comprehensive manual test cases
- Sample CSV files provided
- Multiple format variations

---

## Scalability Considerations

### Current Limitations
- In-memory file processing
- No persistent storage
- Synchronous batch processing
- Single server instance

### Scalability Improvements (Future)

#### Short Term
1. Add Redis for caching
2. Implement queue system (Bull/BullMQ)
3. Add database for results storage
4. Implement pagination for large results

#### Long Term
1. Microservices architecture
2. Message queue for async processing
3. Multiple backend instances with load balancer
4. CDN for frontend assets
5. Database sharding
6. Dedicated file storage (S3/GCS)

---

## Monitoring & Observability

### Metrics to Track
- API response times
- OpenAI API costs
- File upload success rate
- AI extraction accuracy
- Error rates
- User engagement

### Logging
- Request/response logging
- Error logging
- AI prompt/response logging (for debugging)
- Performance metrics

### Tools (Future)
- Sentry for error tracking
- Vercel Analytics for frontend
- Custom logging service
- OpenAI usage dashboard

---

## Future Enhancements

### Features
1. User authentication & authorization
2. Database storage for processed records
3. Direct CRM integration (API push)
4. Webhook notifications
5. Scheduled imports
6. CSV templates
7. Field mapping customization
8. Bulk operations
9. Export to multiple formats
10. Multi-language support

### Technical Improvements
1. WebSocket for real-time progress
2. Virtual scrolling for large tables
3. Advanced caching strategies
4. Background job processing
5. Multi-file upload
6. Column mapping UI
7. Data validation rules engine
8. A/B testing framework

---

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor OpenAI API changes
- Review and optimize AI prompts
- Check error logs
- Monitor costs
- Update documentation

### Backup Strategy
- Version control (Git)
- Configuration backups
- Database backups (when implemented)
- Regular testing of disaster recovery

---

## Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Meaningful variable names
- Comprehensive comments

### Git Workflow
- Feature branches
- Pull request reviews
- Commit message conventions
- Version tagging

### Documentation
- Update README for new features
- Document API changes
- Update architecture docs
- Include testing instructions

---

## License

MIT License - See LICENSE file for details

---

## Support

For questions or issues:
- Email: varun@groweasy.ai
- GitHub Issues: [repository]/issues
- Documentation: See README.md, TESTING.md, DEPLOYMENT.md
