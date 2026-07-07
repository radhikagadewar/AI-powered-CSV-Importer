# Quick Reference Guide

Fast lookup for common tasks and commands.

## 🚀 Quick Start

```bash
# Clone repository
git clone <repo-url>
cd csv-importer

# Setup backend
cd backend
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
npm install
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## 📝 Common Commands

### Backend
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production server |
| `npm test` | Run tests (future) |

### Frontend
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

### Docker
| Command | Purpose |
|---------|---------|
| `docker-compose up` | Start containers |
| `docker-compose up --build` | Rebuild and start |
| `docker-compose down` | Stop containers |
| `docker-compose logs` | View logs |

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001
OPENAI_API_KEY=sk-...
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📡 API Endpoints

### Upload CSV
```http
POST http://localhost:3001/api/csv/upload
Content-Type: multipart/form-data
Body: file=<csv-file>
```

### Process CSV
```http
POST http://localhost:3001/api/csv/process
Content-Type: application/json
Body: {"headers": [...], "rows": [...]}
```

### Health Check
```http
GET http://localhost:3001/api/csv/health
```

## 🧪 Quick Test

```bash
# Upload test file
curl -X POST http://localhost:3001/api/csv/upload \
  -F "file=@sample-csvs/facebook-leads.csv"

# Check health
curl http://localhost:3001/api/csv/health
```

## 🎨 Component Props

### CSVUploader
```typescript
<CSVUploader 
  onFileSelect={(file: File) => void}
  isUploading={boolean}
/>
```

### CSVPreview
```typescript
<CSVPreview 
  data={CSVData}
  onConfirm={() => void}
  onCancel={() => void}
  isProcessing={boolean}
/>
```

### ResultsTable
```typescript
<ResultsTable 
  results={ProcessResponse}
  onReset={() => void}
/>
```

## 📦 Key Types

```typescript
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

interface CSVData {
  headers: string[];
  rows: string[][];
  totalRows?: number;
}
```

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if API key is set
cat backend/.env | grep OPENAI_API_KEY

# Kill port 3001
# Windows: netstat -ano | findstr :3001
# Mac/Linux: lsof -ti:3001 | xargs kill -9
```

### Frontend won't connect
```bash
# Check backend is running
curl http://localhost:3001/api/csv/health

# Check environment
cat frontend/.env.local
```

### Build errors
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📂 File Locations

| Item | Location |
|------|----------|
| Backend routes | `backend/src/routes/` |
| Backend services | `backend/src/services/` |
| Frontend components | `frontend/src/components/` |
| Frontend pages | `frontend/src/app/` |
| Types | `*/src/types/index.ts` |
| Styles | `frontend/src/app/globals.css` |
| Sample CSVs | `sample-csvs/` |

## 🎯 AI Prompt Location

The AI prompt engineering logic is in:
```
backend/src/services/ai.service.ts
└── createPrompt() method
```

## 🚢 Deployment Commands

### Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel
```

### Railway (Backend)
```bash
# Push to GitHub, then connect in Railway dashboard
# Or use Railway CLI:
npm install -g railway
railway up
```

### Docker
```bash
# Build images
docker build -t csv-backend backend/
docker build -t csv-frontend frontend/

# Run
docker run -p 3001:3001 csv-backend
docker run -p 3000:3000 csv-frontend
```

## 🔐 Security Checklist

- [ ] Never commit .env files
- [ ] Use environment variables for secrets
- [ ] Validate all file uploads
- [ ] Sanitize user inputs
- [ ] Enable CORS only for known origins
- [ ] Set file size limits
- [ ] Implement rate limiting (production)

## 📊 Performance Tips

### Backend
- Adjust batch size in `ai.service.ts` (default: 10)
- Enable compression middleware
- Add caching for repeated requests
- Use connection pooling

### Frontend
- Use Next.js Image optimization
- Implement virtual scrolling for large tables
- Lazy load components
- Optimize bundle size

## 🧩 Adding Features

### New API Endpoint
1. Add route in `backend/src/routes/csv.routes.ts`
2. Add service logic in `backend/src/services/`
3. Add types in `backend/src/types/index.ts`
4. Update frontend API calls

### New Component
1. Create file in `frontend/src/components/`
2. Add TypeScript interface for props
3. Import in page.tsx
4. Update styles if needed

### New CSV Field
1. Update `CRMRecord` interface in types
2. Update AI prompt in `ai.service.ts`
3. Update ResultsTable columns
4. Update CSV download headers

## 📞 Getting Help

| Issue | Resource |
|-------|----------|
| Setup problems | SETUP_CHECKLIST.md |
| Testing | TESTING.md |
| Deployment | DEPLOYMENT.md |
| Architecture | ARCHITECTURE.md |
| Bug report | GitHub Issues |
| Questions | varun@groweasy.ai |

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature

# Create pull request on GitHub
```

## 📈 Monitoring

### Check OpenAI Usage
- Visit: https://platform.openai.com/usage
- Monitor costs and request counts

### Check Application Health
```bash
# Backend health
curl http://localhost:3001/api/csv/health

# Check logs
# Backend console
# Frontend console (browser DevTools)
```

## 🎨 Styling

### Tailwind Classes Quick Reference
```css
/* Layout */
.container, .mx-auto, .px-4

/* Spacing */
.p-4, .m-4, .space-x-2, .gap-4

/* Flex/Grid */
.flex, .grid, .grid-cols-3

/* Colors */
.bg-primary-600, .text-white

/* Dark mode */
.dark:bg-gray-900, .dark:text-white

/* Custom classes in globals.css */
.btn, .btn-primary, .card, .table
```

## 📋 Sample CSV Formats

| File | Use Case |
|------|----------|
| facebook-leads.csv | Standard contact format |
| google-ads.csv | Date handling test |
| real-estate.csv | Data source mapping |
| mixed-format.csv | Edge cases & validation |

## ⚡ Performance Benchmarks

| Rows | Expected Time |
|------|---------------|
| 10 | 2-5 seconds |
| 50 | 10-20 seconds |
| 100 | 20-40 seconds |
| 500 | 2-5 minutes |

## 🔢 Version Info

- **Node.js**: 18+
- **Next.js**: 14.1.0
- **TypeScript**: 5.3+
- **React**: 18.2
- **OpenAI SDK**: 4.28+

## 📱 Responsive Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
```

## 🎯 Key Features Checklist

- [x] Drag & drop upload
- [x] CSV preview table
- [x] AI-powered extraction
- [x] Intelligent field mapping
- [x] CRM status mapping
- [x] Data source recognition
- [x] Multiple contact handling
- [x] Validation & skipping
- [x] Results display
- [x] CSV download
- [x] Dark mode
- [x] Responsive design
- [x] Error handling
- [x] Loading states
- [x] Batch processing

## 🔗 Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com
- **OpenAI API**: https://platform.openai.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev

## 💡 Tips & Tricks

1. **Use sample CSVs** for quick testing
2. **Monitor OpenAI costs** in dashboard
3. **Test dark mode** during development
4. **Check mobile layout** with DevTools
5. **Clear .next folder** if build issues
6. **Use TypeScript** for better DX
7. **Enable ESLint** in your editor
8. **Use React DevTools** for debugging

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2026-07-07  
**For**: GrowEasy CSV Importer
