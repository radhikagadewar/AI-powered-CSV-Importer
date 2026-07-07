# Project Structure

Complete file structure of the AI-Powered CSV Importer project.

```
csv-importer/
│
├── 📄 README.md                      # Main project documentation
├── 📄 ARCHITECTURE.md                # System architecture details
├── 📄 TESTING.md                     # Comprehensive testing guide
├── 📄 DEPLOYMENT.md                  # Deployment instructions
├── 📄 SETUP_CHECKLIST.md            # Step-by-step setup guide
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 🐳 docker-compose.yml             # Docker orchestration
├── 🚫 .gitignore                     # Git ignore rules
├── 🔧 start.sh                       # Unix startup script
└── 🔧 start.bat                      # Windows startup script
│
├── 📁 backend/                       # Backend Application
│   ├── 📄 package.json               # Dependencies & scripts
│   ├── 📄 tsconfig.json              # TypeScript configuration
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 .eslintrc.json            # ESLint configuration
│   ├── 🐳 Dockerfile                 # Docker image definition
│   │
│   └── 📁 src/                       # Source code
│       ├── 📄 index.ts               # Express server entry
│       │
│       ├── 📁 routes/                # API routes
│       │   └── 📄 csv.routes.ts      # CSV endpoints
│       │
│       ├── 📁 services/              # Business logic
│       │   ├── 📄 csv.service.ts     # CSV parsing service
│       │   └── 📄 ai.service.ts      # AI extraction service
│       │
│       ├── 📁 utils/                 # Helper functions
│       │   └── 📄 validation.ts      # Validation utilities
│       │
│       └── 📁 types/                 # TypeScript types
│           └── 📄 index.ts           # Type definitions
│
├── 📁 frontend/                      # Frontend Application
│   ├── 📄 package.json               # Dependencies & scripts
│   ├── 📄 tsconfig.json              # TypeScript configuration
│   ├── 📄 next.config.js             # Next.js configuration
│   ├── 📄 tailwind.config.ts         # Tailwind CSS config
│   ├── 📄 postcss.config.js          # PostCSS configuration
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 .eslintrc.json            # ESLint configuration
│   ├── 🐳 Dockerfile                 # Docker image definition
│   │
│   └── 📁 src/                       # Source code
│       ├── 📁 app/                   # Next.js App Router
│       │   ├── 📄 page.tsx           # Main page component
│       │   ├── 📄 layout.tsx         # Root layout
│       │   └── 📄 globals.css        # Global styles
│       │
│       ├── 📁 components/            # React components
│       │   ├── 📄 CSVUploader.tsx    # File upload component
│       │   ├── 📄 CSVPreview.tsx     # Preview table component
│       │   ├── 📄 ResultsTable.tsx   # Results display component
│       │   └── 📄 ThemeToggle.tsx    # Dark mode toggle
│       │
│       └── 📁 types/                 # TypeScript types
│           └── 📄 index.ts           # Type definitions
│
└── 📁 sample-csvs/                   # Test CSV files
    ├── 📄 facebook-leads.csv         # Facebook format example
    ├── 📄 google-ads.csv             # Google Ads format example
    ├── 📄 real-estate.csv            # Real estate format example
    └── 📄 mixed-format.csv           # Mixed format example
```

## File Count Summary

- **Total Files**: 41
- **TypeScript Files**: 13
- **Configuration Files**: 10
- **Documentation Files**: 6
- **Sample CSV Files**: 4
- **Docker Files**: 3
- **Scripts**: 2
- **Other**: 3

## Key Directories

### `/backend/src/`
**Purpose**: Backend application source code  
**Technologies**: Node.js, Express, TypeScript  
**Lines of Code**: ~800

### `/frontend/src/`
**Purpose**: Frontend application source code  
**Technologies**: Next.js, React, TypeScript, Tailwind CSS  
**Lines of Code**: ~1000

### `/sample-csvs/`
**Purpose**: Test data for various CSV formats  
**Use**: Testing and demonstration

## Key Files

### Root Level

| File | Purpose | Lines |
|------|---------|-------|
| `README.md` | Project overview and setup | ~200 |
| `ARCHITECTURE.md` | System architecture documentation | ~800 |
| `TESTING.md` | Testing guide and procedures | ~400 |
| `DEPLOYMENT.md` | Deployment instructions | ~500 |
| `SETUP_CHECKLIST.md` | Setup verification checklist | ~300 |
| `docker-compose.yml` | Docker container orchestration | ~30 |
| `start.sh` | Unix startup script | ~60 |
| `start.bat` | Windows startup script | ~60 |

### Backend

| File | Purpose | Lines |
|------|---------|-------|
| `src/index.ts` | Express server setup | ~80 |
| `src/routes/csv.routes.ts` | API route handlers | ~150 |
| `src/services/csv.service.ts` | CSV parsing logic | ~100 |
| `src/services/ai.service.ts` | AI extraction logic | ~250 |
| `src/utils/validation.ts` | Validation functions | ~60 |
| `src/types/index.ts` | Type definitions | ~50 |
| `package.json` | Dependencies & scripts | ~40 |
| `tsconfig.json` | TypeScript config | ~20 |

### Frontend

| File | Purpose | Lines |
|------|---------|-------|
| `src/app/page.tsx` | Main page component | ~250 |
| `src/app/layout.tsx` | Root layout | ~20 |
| `src/app/globals.css` | Global styles | ~150 |
| `src/components/CSVUploader.tsx` | Upload component | ~80 |
| `src/components/CSVPreview.tsx` | Preview component | ~120 |
| `src/components/ResultsTable.tsx` | Results component | ~200 |
| `src/components/ThemeToggle.tsx` | Theme toggle | ~40 |
| `src/types/index.ts` | Type definitions | ~50 |
| `package.json` | Dependencies & scripts | ~30 |
| `tsconfig.json` | TypeScript config | ~30 |
| `tailwind.config.ts` | Tailwind config | ~30 |

## Technology Breakdown

### Backend Stack
```
Node.js (Runtime)
├── Express (Web Framework)
├── TypeScript (Language)
├── Multer (File Upload)
├── csv-parse (CSV Parsing)
├── OpenAI SDK (AI Integration)
└── CORS (Cross-Origin)
```

### Frontend Stack
```
Next.js 14 (Framework)
├── React 18 (UI Library)
├── TypeScript (Language)
├── Tailwind CSS (Styling)
├── React Dropzone (File Upload)
└── Lucide React (Icons)
```

### Development Tools
```
Development
├── ts-node-dev (Backend dev server)
├── Next.js dev server (Frontend dev)
├── ESLint (Linting)
└── TypeScript compiler

Deployment
├── Docker & Docker Compose
├── Vercel (Frontend hosting)
└── Railway/Render (Backend hosting)
```

## Code Statistics

### Total Lines of Code
- **Backend**: ~800 lines
- **Frontend**: ~1000 lines
- **Configuration**: ~200 lines
- **Documentation**: ~2500 lines
- **Total**: ~4500 lines

### File Size Distribution
- Small (<50 lines): 15 files
- Medium (50-200 lines): 18 files
- Large (200+ lines): 8 files

## Dependencies

### Backend Dependencies (8)
1. express - Web framework
2. cors - CORS middleware
3. dotenv - Environment variables
4. multer - File upload
5. csv-parse - CSV parsing
6. openai - OpenAI API client
7. zod - Schema validation (optional)
8. TypeScript & types

### Frontend Dependencies (6)
1. next - Next.js framework
2. react - React library
3. react-dom - React DOM
4. react-dropzone - File upload
5. lucide-react - Icons
6. TypeScript & types

### Dev Dependencies (12)
- TypeScript compiler
- Type definitions (@types/*)
- ts-node-dev
- ESLint & configs
- Tailwind CSS
- PostCSS
- Autoprefixer
- Jest (for future testing)

## Build Artifacts (gitignored)

```
Build Outputs
├── backend/dist/           # Compiled backend code
├── frontend/.next/         # Next.js build output
└── frontend/out/           # Static export (if used)

Dependencies
├── backend/node_modules/
└── frontend/node_modules/

Environment
├── backend/.env
└── frontend/.env.local

Logs
└── *.log files
```

## Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler settings |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins |
| `next.config.js` | Next.js configuration |
| `.eslintrc.json` | ESLint rules |
| `.gitignore` | Git exclusions |
| `.env.example` | Environment template |
| `docker-compose.yml` | Docker services |
| `Dockerfile` | Docker image |

## Documentation Files

| File | Purpose | Target Audience |
|------|---------|-----------------|
| `README.md` | Overview & quickstart | All users |
| `ARCHITECTURE.md` | Technical details | Developers |
| `TESTING.md` | Test procedures | QA & Developers |
| `DEPLOYMENT.md` | Deploy instructions | DevOps |
| `SETUP_CHECKLIST.md` | Setup verification | New developers |
| `PROJECT_STRUCTURE.md` | File organization | All users |

## Sample CSV Files

| File | Format | Rows | Purpose |
|------|--------|------|---------|
| `facebook-leads.csv` | Facebook export | 5 | Test standard format |
| `google-ads.csv` | Google Ads | 4 | Test date handling |
| `real-estate.csv` | Real estate CRM | 4 | Test data sources |
| `mixed-format.csv` | Various | 5 | Test edge cases |

## Entry Points

### Development
- **Backend**: `backend/src/index.ts` → `npm run dev`
- **Frontend**: `frontend/src/app/page.tsx` → `npm run dev`

### Production
- **Backend**: `backend/dist/index.js` → `npm start`
- **Frontend**: `frontend/.next/` → `npm start`

### Testing
- **Manual**: Use sample-csvs/ files
- **API**: Use curl or Postman
- **E2E**: Open http://localhost:3000

## Module Structure

### Backend Modules
```
index.ts
├── routes/
│   └── csv.routes.ts
│       ├── POST /api/csv/upload
│       ├── POST /api/csv/process
│       └── GET /api/csv/health
│
├── services/
│   ├── csv.service.ts
│   │   ├── parseCSV()
│   │   ├── validateCSV()
│   │   └── createBatches()
│   │
│   └── ai.service.ts
│       ├── createPrompt()
│       ├── processBatch()
│       └── processInBatches()
│
└── utils/
    └── validation.ts
        ├── validateRecord()
        ├── isValidEmail()
        └── sanitizeCSVValue()
```

### Frontend Components
```
app/
├── layout.tsx (Root)
└── page.tsx (Main)
    ├── CSVUploader
    ├── CSVPreview
    ├── ResultsTable
    └── ThemeToggle
```

## Growth Potential

This structure supports:
- ✅ Adding new API endpoints
- ✅ Adding new frontend pages
- ✅ Adding new services
- ✅ Adding database layer
- ✅ Adding authentication
- ✅ Adding testing suite
- ✅ Microservices migration
- ✅ Multiple AI providers

## Maintenance

### Regular Updates
- Dependencies: Monthly
- Documentation: As needed
- Sample files: As needed
- Tests: With new features

### Code Organization
- Clear separation of concerns
- Modular architecture
- Reusable components
- Type-safe interfaces

---

**Last Updated**: 2026-07-07  
**Project Version**: 1.0.0  
**Total Files**: 41  
**Total Lines**: ~4500
