import { Router, Request, Response } from 'express';
import multer from 'multer';
import csvService from '../services/csv.service';
import aiService from '../services/ai.service';
import demoAIService from '../services/demo-ai.service';
import { CSVData, ProcessResponse, SkippedRecord } from '../types';

const router = Router();

// Use demo mode if OPENAI_API_KEY is not set or USE_DEMO_MODE=true
const USE_DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.USE_DEMO_MODE === 'true';

if (USE_DEMO_MODE) {
  console.log('🎭 Running in DEMO MODE - No OpenAI API calls will be made');
  console.log('💡 To use real AI: Add OPENAI_API_KEY to .env and set USE_DEMO_MODE=false');
}

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

/**
 * POST /api/csv/upload
 * Upload and parse CSV file
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Parse CSV
    const csvData = csvService.parseCSV(req.file.buffer);

    // Validate CSV structure
    const validation = csvService.validateCSV(csvData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Return preview
    res.json({
      success: true,
      data: {
        headers: csvData.headers,
        rows: csvData.rows,
        totalRows: csvData.rows.length
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process CSV file'
    });
  }
});

/**
 * POST /api/csv/process
 * Process CSV data with AI extraction
 */
router.post('/process', async (req: Request, res: Response) => {
  try {
    const csvData: CSVData = req.body;

    if (!csvData || !csvData.headers || !csvData.rows) {
      return res.status(400).json({
        success: false,
        error: 'Invalid CSV data'
      });
    }

    // Validate CSV
    const validation = csvService.validateCSV(csvData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Process with AI in batches
    const service = USE_DEMO_MODE ? demoAIService : aiService;
    const result = await service.processInBatches(csvData, 10);

    // Build skipped records details
    const skippedRecords: SkippedRecord[] = result.skipped.map(rowIndex => ({
      row: csvData.rows[rowIndex],
      reason: 'Missing both email and mobile number or invalid data',
      rowNumber: rowIndex + 2 // +2 because: +1 for 1-based indexing, +1 for header row
    }));

    const response: ProcessResponse = {
      records: result.records,
      skipped: skippedRecords,
      stats: {
        total: csvData.rows.length,
        imported: result.records.length,
        skipped: skippedRecords.length
      }
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process CSV with AI'
    });
  }
});

/**
 * POST /api/csv/process-stream
 * Process CSV with progress updates (bonus feature)
 */
router.post('/process-stream', async (req: Request, res: Response) => {
  try {
    const csvData: CSVData = req.body;

    if (!csvData || !csvData.headers || !csvData.rows) {
      return res.status(400).json({
        success: false,
        error: 'Invalid CSV data'
      });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Process with progress updates
    const service = USE_DEMO_MODE ? demoAIService : aiService;
    const result = await service.processInBatches(
      csvData,
      10,
      (processed, total) => {
        const progress = Math.round((processed / total) * 100);
        res.write(`data: ${JSON.stringify({ progress, processed, total })}\n\n`);
      }
    );

    // Build final response
    const skippedRecords: SkippedRecord[] = result.skipped.map(rowIndex => ({
      row: csvData.rows[rowIndex],
      reason: 'Missing both email and mobile number or invalid data',
      rowNumber: rowIndex + 2
    }));

    const response: ProcessResponse = {
      records: result.records,
      skipped: skippedRecords,
      stats: {
        total: csvData.rows.length,
        imported: result.records.length,
        skipped: skippedRecords.length
      }
    };

    // Send final result
    res.write(`data: ${JSON.stringify({ done: true, data: response })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Stream process error:', error);
    res.write(`data: ${JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Processing failed' 
    })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
