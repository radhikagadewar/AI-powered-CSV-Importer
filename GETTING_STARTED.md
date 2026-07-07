# Getting Started with GrowEasy CSV Importer

Welcome! This guide will help you get the AI-Powered CSV Importer up and running in minutes.

## 📋 What You'll Need

Before starting, make sure you have:
- ✅ **Node.js 18+** - [Download here](https://nodejs.org)
- ✅ **npm** (comes with Node.js)
- ✅ **OpenAI API Key** - [Get one here](https://platform.openai.com)
- ✅ **Text Editor** - VS Code recommended
- ✅ **Terminal/Command Prompt**

## 🚀 Quick Start (5 Minutes)

### Step 1: Get the Code

If you cloned from GitHub:
```bash
cd csv-importer
```

If you extracted from ZIP:
```bash
cd path/to/csv-importer
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env

# Edit .env and add your OpenAI API key
# Use notepad, nano, vim, or any text editor
```

**Edit backend/.env:**
```env
PORT=3001
OPENAI_API_KEY=sk-your-actual-openai-key-here
NODE_ENV=development
```

**Start backend:**
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📊 Environment: development
🔗 API: http://localhost:3001
```

### Step 3: Setup Frontend

**Open a NEW terminal window** (keep backend running)

```bash
# Navigate to frontend from project root
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### Step 4: Open Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the GrowEasy CSV Importer interface!

## 🎯 First Test

Let's verify everything works:

1. **Upload a CSV**:
   - Drag and drop `sample-csvs/facebook-leads.csv`
   - Or click to browse and select it

2. **Preview**:
   - You should see a table with 5 rows
   - Headers: Full Name, Email Address, Phone Number, etc.

3. **Process**:
   - Click "Confirm & Process with AI"
   - Wait 5-10 seconds for AI processing

4. **Results**:
   - You should see:
     - Total: 5 rows
     - Imported: 5 records
     - Skipped: 0 records
   - A table showing the extracted CRM data

5. **Download**:
   - Click "Download CSV"
   - Open the downloaded file
   - Verify it has GrowEasy CRM format

**If all steps work, congratulations! 🎉 Your setup is complete!**

## 🔧 Using the Startup Scripts

Instead of manual setup, you can use our automated scripts:

### Windows Users

Double-click `start.bat` or run:
```bash
start.bat
```

This will:
- Check Node.js installation
- Install dependencies
- Start both servers automatically

### Mac/Linux Users

First make it executable:
```bash
chmod +x start.sh
```

Then run:
```bash
./start.sh
```

This will:
- Check Node.js installation
- Install dependencies
- Start both servers automatically

## 📁 Understanding the Project

```
csv-importer/
│
├── backend/              ← Node.js + Express API
│   ├── src/
│   │   ├── index.ts      ← Server entry point
│   │   ├── routes/       ← API endpoints
│   │   ├── services/     ← Business logic
│   │   └── types/        ← TypeScript types
│   └── package.json
│
├── frontend/             ← Next.js + React UI
│   ├── src/
│   │   ├── app/          ← Pages and layouts
│   │   ├── components/   ← UI components
│   │   └── types/        ← TypeScript types
│   └── package.json
│
├── sample-csvs/          ← Test files
│   ├── facebook-leads.csv
│   ├── google-ads.csv
│   ├── real-estate.csv
│   └── mixed-format.csv
│
└── Documentation files (you're reading one!)
```

## 🎓 Learning Path

Follow this order to understand the project:

1. **Start Here**: GETTING_STARTED.md (this file)
2. **Overview**: README.md
3. **Try it**: Test with sample CSV files
4. **Deep Dive**: ARCHITECTURE.md
5. **Testing**: TESTING.md
6. **Deploy**: DEPLOYMENT.md
7. **Quick Ref**: QUICK_REFERENCE.md

## 🧪 Testing Different CSV Formats

Try all sample files to see how AI handles different formats:

### 1. Facebook Leads (Standard Format)
```bash
sample-csvs/facebook-leads.csv
```
**Features**:
- Standard column names
- Status text mapping
- 5 sample leads

### 2. Google Ads (Date Handling)
```bash
sample-csvs/google-ads.csv
```
**Features**:
- Different column names
- Date parsing
- Lead quality mapping
- 4 sample leads

### 3. Real Estate (Data Sources)
```bash
sample-csvs/real-estate.csv
```
**Features**:
- Multiple contact fields
- Property source recognition
- Complex field mapping
- 4 sample leads

### 4. Mixed Format (Edge Cases)
```bash
sample-csvs/mixed-format.csv
```
**Features**:
- Various column naming
- Missing data handling
- Different date formats
- 5 sample leads (1 invalid)

## 💡 Tips for Success

### Do's ✅
- **Test with sample files first** - They're designed to show all features
- **Check console logs** - Helpful debugging information
- **Read error messages** - They guide you to the problem
- **Try dark mode** - Click the moon icon (top right)
- **Test on mobile** - Use browser dev tools
- **Explore the code** - It's well-documented

### Don'ts ❌
- **Don't commit .env files** - They contain secrets
- **Don't use production API keys** - Use development keys
- **Don't skip documentation** - It answers most questions
- **Don't ignore warnings** - They prevent future issues

## 🐛 Common Issues & Fixes

### "Cannot find module" Error

**Problem**: Missing dependencies

**Fix**:
```bash
# In backend or frontend directory
rm -rf node_modules
npm install
```

### "Port already in use" Error

**Problem**: Port 3000 or 3001 is occupied

**Fix for Windows**:
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Fix for Mac/Linux**:
```bash
lsof -ti:3001 | xargs kill -9
```

### "OPENAI_API_KEY not configured" Error

**Problem**: Missing or incorrect API key

**Fix**:
1. Check `backend/.env` file exists
2. Verify API key starts with `sk-`
3. Make sure there are no extra spaces
4. Restart backend server

### Frontend Can't Connect to Backend

**Problem**: CORS or wrong API URL

**Fix**:
1. Verify backend is running on port 3001
2. Check `frontend/.env.local` has correct URL
3. Restart frontend server

### AI Processing Fails

**Problem**: OpenAI API issue

**Fix**:
1. Verify API key is valid
2. Check OpenAI account has credits
3. Check internet connection
4. Review API usage limits

## 📊 What Happens Behind the Scenes

### When You Upload a CSV:

1. **Frontend** validates file type
2. **Frontend** sends file to backend
3. **Backend** parses CSV with csv-parse
4. **Backend** validates structure
5. **Backend** returns preview data
6. **Frontend** displays in table

### When You Click "Confirm & Process":

1. **Frontend** sends CSV data to backend
2. **Backend** splits into batches (10 rows each)
3. **For each batch**:
   - Creates AI prompt with instructions
   - Calls OpenAI GPT-4o-mini
   - Receives structured JSON
   - Validates each record
   - Sanitizes data
4. **Backend** combines all results
5. **Backend** returns processed data
6. **Frontend** displays results

### AI Prompt Does:

- Analyzes column names intelligently
- Maps to GrowEasy CRM fields
- Infers CRM status from text
- Recognizes property sources
- Consolidates multiple contacts
- Validates email/phone presence
- Maintains CSV integrity

## 🎨 User Interface Tour

### Main Page

```
┌─────────────────────────────────────┐
│ 🎯 GrowEasy CSV Importer    🌓 Theme │
├─────────────────────────────────────┤
│                                      │
│  Step Indicator:  1 → 2 → 3         │
│                                      │
│  ┌──────────────────────────────┐   │
│  │     📁 Drag & Drop Area      │   │
│  │    or click to browse        │   │
│  └──────────────────────────────┘   │
│                                      │
└─────────────────────────────────────┘
```

### Preview Page

```
┌─────────────────────────────────────┐
│ CSV Preview                          │
│ Total rows: 5 (showing first 10)     │
├─────────────────────────────────────┤
│ # │ Full Name │ Email │ Phone │ ... │
│ 1 │ John Doe  │ ...   │ ...   │ ... │
│ 2 │ Sarah J.  │ ...   │ ...   │ ... │
├─────────────────────────────────────┤
│ [Cancel]    [Confirm & Process AI] │
└─────────────────────────────────────┘
```

### Results Page

```
┌─────────────────────────────────────┐
│ Import Results                       │
├───────────┬───────────┬─────────────┤
│ 📊 Total  │ ✅ Import │ ❌ Skipped  │
│    100    │    95     │     5       │
├───────────┴───────────┴─────────────┤
│ Imported Records (95)  [Download CSV]│
│ [Table with all imported records]    │
│                                      │
│ Skipped Records (5)                  │
│ [Table with skipped records]         │
│                                      │
│      [Import Another CSV]            │
└─────────────────────────────────────┘
```

## 🔐 Security Notes

- ✅ API keys are in `.env` (never committed)
- ✅ File uploads validated (CSV only, 10MB max)
- ✅ Input sanitization implemented
- ✅ CORS configured for security
- ✅ No sensitive data in logs

## 🚀 Next Steps

Now that you're set up:

1. **Explore Features**:
   - Try all sample CSV files
   - Test dark mode
   - Try on mobile
   - Test error handling

2. **Read Documentation**:
   - ARCHITECTURE.md for technical details
   - TESTING.md for test procedures
   - DEPLOYMENT.md for going live

3. **Customize** (Optional):
   - Adjust batch size in ai.service.ts
   - Modify color scheme in tailwind.config.ts
   - Add new CRM fields in types/index.ts

4. **Deploy** (When Ready):
   - Follow DEPLOYMENT.md
   - Deploy to Vercel + Railway
   - Share your live URL!

## 📞 Need Help?

### Documentation
- **Quick answers**: QUICK_REFERENCE.md
- **Setup issues**: SETUP_CHECKLIST.md
- **Testing**: TESTING.md
- **Deployment**: DEPLOYMENT.md
- **Architecture**: ARCHITECTURE.md

### Contact
- **Email**: varun@groweasy.ai
- **Include**: Error messages, steps taken, screenshots

### Debugging Tips
1. Check browser console (F12)
2. Check backend terminal logs
3. Verify environment variables
4. Test with sample CSVs first
5. Try restarting servers

## ✅ Success Checklist

You're ready to use the app when:
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can upload a CSV file
- [ ] Preview displays correctly
- [ ] AI processing completes
- [ ] Results display correctly
- [ ] Can download processed CSV
- [ ] Dark mode toggle works

## 🎉 You're All Set!

If you've completed the quick start and first test successfully, you're ready to:
- Explore the application
- Test different CSV formats
- Read the documentation
- Deploy to production
- Submit your project

**Happy coding!** 🚀

---

**Questions?** Check QUICK_REFERENCE.md for fast answers  
**Issues?** See SETUP_CHECKLIST.md for troubleshooting  
**Ready to deploy?** See DEPLOYMENT.md for instructions

**Welcome to the GrowEasy CSV Importer!** 🎯
