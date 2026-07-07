# Setup Checklist

Use this checklist to ensure your development environment is properly configured.

## Prerequisites

- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```
- [ ] npm or yarn installed
  ```bash
  npm --version   # Should show 9.x.x or higher
  ```
- [ ] Git installed (for version control)
  ```bash
  git --version
  ```
- [ ] OpenAI API account created
  - Visit: https://platform.openai.com
  - Create account if needed
  - Generate API key from API Keys section

## Initial Setup

### 1. Clone/Download Repository
- [ ] Repository cloned or downloaded
- [ ] Navigate to project directory
  ```bash
  cd csv-importer
  ```

### 2. Backend Setup
- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```
- [ ] Copy environment file
  ```bash
  # Windows
  copy .env.example .env
  
  # Mac/Linux
  cp .env.example .env
  ```
- [ ] Edit `.env` file and add your OpenAI API key
  ```env
  PORT=3001
  OPENAI_API_KEY=sk-your-actual-key-here
  NODE_ENV=development
  ```
- [ ] Save the `.env` file
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Verify TypeScript compiles
  ```bash
  npm run build
  ```
- [ ] Start backend server
  ```bash
  npm run dev
  ```
- [ ] Verify backend is running
  - Open browser: http://localhost:3001
  - Should see API info page
  - Check health endpoint: http://localhost:3001/api/csv/health
  - Should see: `{"success":true,"message":"Server is running"}`

### 3. Frontend Setup
Open a **new terminal window** (keep backend running)

- [ ] Navigate to frontend directory
  ```bash
  cd frontend  # From project root
  ```
- [ ] Create environment file (optional, has defaults)
  ```bash
  # Windows
  echo NEXT_PUBLIC_API_URL=http://localhost:3001 > .env.local
  
  # Mac/Linux
  echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Start frontend server
  ```bash
  npm run dev
  ```
- [ ] Verify frontend is running
  - Open browser: http://localhost:3000
  - Should see "GrowEasy CSV Importer" page
  - Should see file upload interface

## Verification Tests

### Basic Functionality Test
- [ ] File upload works
  - Drag and drop `sample-csvs/facebook-leads.csv`
  - OR click to browse and select file
  - Should show preview table
- [ ] Preview displays correctly
  - Headers visible
  - Data rows visible
  - Row count shows 5 rows
- [ ] AI processing works
  - Click "Confirm & Process with AI"
  - Wait for processing (may take 5-15 seconds)
  - Should show results page with:
    - Stats cards (Total, Imported, Skipped)
    - Imported records table
    - Download CSV button
- [ ] Download works
  - Click "Download CSV"
  - CSV file should download
  - Open in Excel/Sheets to verify

### Feature Tests
- [ ] Dark mode toggle works
  - Click moon icon (top right)
  - UI switches to dark theme
  - Click sun icon to switch back
- [ ] Multiple CSV formats work
  - Test with `sample-csvs/google-ads.csv`
  - Test with `sample-csvs/real-estate.csv`
  - Test with `sample-csvs/mixed-format.csv`
  - All should process successfully
- [ ] Error handling works
  - Try uploading a .txt file
  - Should show error message
  - Try uploading without OpenAI key
  - Should show API error

## Development Tools (Optional)

### VS Code Extensions (Recommended)
- [ ] ESLint
- [ ] Prettier
- [ ] Tailwind CSS IntelliSense
- [ ] TypeScript Hero
- [ ] REST Client (for API testing)

### Browser Extensions (Recommended)
- [ ] React Developer Tools
- [ ] JSON Viewer

## Troubleshooting

### Backend Won't Start

**Issue**: `OPENAI_API_KEY is not configured`
- **Fix**: Edit `backend/.env` and add valid API key

**Issue**: `Port 3001 already in use`
- **Fix**: Change PORT in `.env` or kill existing process
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3001 | xargs kill -9
  ```

**Issue**: `Cannot find module`
- **Fix**: Delete `node_modules` and reinstall
  ```bash
  rm -rf node_modules
  npm install
  ```

### Frontend Won't Start

**Issue**: `Module not found` errors
- **Fix**: Reinstall dependencies
  ```bash
  rm -rf node_modules .next
  npm install
  ```

**Issue**: `Failed to fetch`
- **Fix**: Ensure backend is running on port 3001
- **Fix**: Check `NEXT_PUBLIC_API_URL` in `.env.local`

### AI Processing Fails

**Issue**: `AI extraction failed`
- **Fix**: Verify OpenAI API key is valid
- **Fix**: Check API quota/limits
- **Fix**: Review OpenAI dashboard for errors

**Issue**: Slow processing
- **Normal**: First request may be slower
- **Fix**: Reduce batch size in `ai.service.ts` if consistently slow
- **Note**: Processing time depends on OpenAI API response time

### CSV Upload Issues

**Issue**: `Only CSV files are allowed`
- **Fix**: Ensure file has .csv extension
- **Fix**: File must be valid CSV format

**Issue**: `CSV must have headers`
- **Fix**: First row must contain header names
- **Fix**: CSV cannot be empty

## Quick Start Scripts

### Windows Users
- [ ] Make `start.bat` executable
- [ ] Double-click `start.bat` to start both servers

### Mac/Linux Users
- [ ] Make script executable
  ```bash
  chmod +x start.sh
  ```
- [ ] Run startup script
  ```bash
  ./start.sh
  ```

## Docker Setup (Optional)

- [ ] Docker installed
  ```bash
  docker --version
  docker-compose --version
  ```
- [ ] Create `.env` file with OpenAI key
- [ ] Build and run
  ```bash
  docker-compose up --build
  ```
- [ ] Access application
  - Frontend: http://localhost:3000
  - Backend: http://localhost:3001

## Production Deployment Checklist

Before deploying to production:

### Security
- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Input validation comprehensive
- [ ] Error messages don't expose sensitive info

### Performance
- [ ] Frontend optimized (next build)
- [ ] Backend built (npm run build)
- [ ] Assets compressed
- [ ] Caching configured
- [ ] Load testing performed

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured (Vercel Analytics)
- [ ] Logging configured
- [ ] Alerting setup
- [ ] Cost monitoring (OpenAI usage)

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment guide reviewed
- [ ] Team onboarding docs prepared

### Testing
- [ ] All manual tests passing
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Multiple CSV formats tested
- [ ] Load testing performed

## Support Resources

### Documentation
- [ ] README.md - Overview and setup
- [ ] TESTING.md - Testing guide
- [ ] DEPLOYMENT.md - Deployment instructions
- [ ] ARCHITECTURE.md - System architecture

### Sample Files
- [ ] facebook-leads.csv - Facebook format
- [ ] google-ads.csv - Google Ads format
- [ ] real-estate.csv - Real estate format
- [ ] mixed-format.csv - Various formats

### External Resources
- [ ] Next.js Docs: https://nextjs.org/docs
- [ ] Express Docs: https://expressjs.com
- [ ] OpenAI API Docs: https://platform.openai.com/docs
- [ ] Tailwind CSS Docs: https://tailwindcss.com/docs

## Contact

If you encounter issues:
- Email: varun@groweasy.ai
- Check documentation files
- Review error logs
- Test with sample CSV files

---

## Completion Status

Mark your overall progress:

- [ ] Prerequisites installed
- [ ] Backend setup complete
- [ ] Frontend setup complete
- [ ] Basic functionality verified
- [ ] All features tested
- [ ] Development tools configured
- [ ] Ready for development
- [ ] Ready for deployment (if applicable)

**Setup Date**: _______________

**Setup By**: _______________

**Notes**: 
_________________________________
_________________________________
_________________________________

---

✅ **Setup Complete!** You're ready to start developing or using the CSV Importer.
