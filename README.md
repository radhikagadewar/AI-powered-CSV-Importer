# AI-Powered CSV Importer for GrowEasy CRM

An intelligent CSV importer that uses AI to extract and map CRM lead information from any CSV format.

## 📚 Documentation

**📖 [Complete Documentation Index](INDEX.md)** - Full guide to all documentation

**🚀 New to the project?** Start with **[Getting Started Guide](GETTING_STARTED.md)**

### Essential Guides
- **[Getting Started](GETTING_STARTED.md)** - Complete beginner's guide (start here!)
- **[Quick Reference](QUICK_REFERENCE.md)** - Fast lookup for commands and common tasks
- **[Setup Checklist](SETUP_CHECKLIST.md)** - Step-by-step setup verification

### Advanced Documentation
- **[Architecture](ARCHITECTURE.md)** - System design and technical details
- **[Testing Guide](TESTING.md)** - Comprehensive testing procedures
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production platforms
- **[Project Structure](PROJECT_STRUCTURE.md)** - Complete file organization
- **[Contributing](CONTRIBUTING.md)** - Guidelines for contributors

### Project Information
- **[Project Summary](PROJECT_SUMMARY.md)** - High-level overview
- **[Submission Guide](SUBMISSION_GUIDE.md)** - How to submit this project
- **[Changelog](CHANGELOG.md)** - Version history

## Position Applied For
[Please specify: Intern / Full-Time]

## Features

- 🎯 **Intelligent Field Mapping**: AI-powered extraction that works with any CSV column structure
- 📊 **Beautiful Preview**: Responsive tables with sticky headers and smooth scrolling
- 🤖 **Multi-LLM Support**: Works with OpenAI, Gemini, or Claude
- 🎨 **Modern UI**: Clean, responsive design with loading states
- 🚀 **Production Ready**: Error handling, validation, and batch processing
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📦 **Drag & Drop**: Easy CSV file upload

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Dropzone

### Backend
- Node.js
- Express
- TypeScript
- OpenAI API (configurable for Gemini/Claude)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (or Gemini/Claude API key)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd csv-importer
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Setup

Create `.env` file in the `backend` directory:

```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
csv-importer/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main upload page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles
│   │   ├── components/
│   │   │   ├── CSVUploader.tsx   # Drag & drop uploader
│   │   │   ├── CSVPreview.tsx    # Preview table
│   │   │   ├── ResultsTable.tsx  # Parsed results
│   │   │   └── ThemeToggle.tsx   # Dark mode toggle
│   │   └── types/
│   │       └── index.ts          # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── routes/
│   │   │   └── csv.routes.ts     # CSV endpoints
│   │   ├── services/
│   │   │   ├── csv.service.ts    # CSV parsing
│   │   │   └── ai.service.ts     # AI extraction
│   │   ├── utils/
│   │   │   └── validation.ts     # Validation logic
│   │   └── types/
│   │       └── index.ts          # TypeScript types
│   └── package.json
└── README.md
```

## API Endpoints

### POST `/api/csv/upload`
Upload and preview CSV file.

**Request:**
- Content-Type: multipart/form-data
- Field: `file` (CSV file)

**Response:**
```json
{
  "success": true,
  "data": {
    "headers": ["Name", "Email", "Phone"],
    "rows": [["John", "john@example.com", "1234567890"]],
    "totalRows": 1
  }
}
```

### POST `/api/csv/process`
Process CSV with AI extraction.

**Request:**
```json
{
  "headers": ["Name", "Email", "Phone"],
  "rows": [["John", "john@example.com", "1234567890"]]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [...],
    "skipped": [...],
    "stats": {
      "total": 100,
      "imported": 95,
      "skipped": 5
    }
  }
}
```

## AI Prompt Engineering

The AI extraction follows these rules:

1. **CRM Status Mapping**: Maps to GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, or SALE_DONE
2. **Data Source**: Maps to leads_on_demand, meridian_tower, eden_park, varah_swamy, or sarjapur_plots
3. **Date Formatting**: Ensures JavaScript Date compatibility
4. **Multiple Contacts**: Consolidates extra emails/phones into crm_note
5. **Validation**: Skips records without email or mobile
6. **CSV Integrity**: Maintains single-row records

## Configuration

### Switching AI Providers

To use Gemini or Claude instead of OpenAI, modify `backend/src/services/ai.service.ts`:

```typescript
// For Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

// For Claude
import Anthropic from '@anthropic-ai/sdk';
```

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel
```

### Railway/Render (Backend)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## Docker Setup (Bonus)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## Sample CSV Files

Test with various formats:
- Facebook Lead Export
- Google Ads Export
- Real Estate CRM exports
- Custom spreadsheets

## Troubleshooting

**Issue: AI extraction fails**
- Verify API key is correct
- Check API quota/limits
- Review batch size settings

**Issue: Large files timeout**
- Increase batch size in ai.service.ts
- Enable streaming if available
- Consider file size limits

**Issue: CORS errors**
- Verify backend URL in frontend config
- Check CORS settings in backend

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT

## Contact

Email: varun@groweasy.ai
