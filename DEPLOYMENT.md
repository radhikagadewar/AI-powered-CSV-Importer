# Deployment Guide

This guide covers deploying the AI-powered CSV Importer to various platforms.

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Recommended for**: Easy setup, free tier available

#### Deploy Backend to Railway

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` directory as root

4. **Configure Environment Variables**
   - Go to Variables tab
   - Add:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `PORT`: 3001 (Railway auto-assigns, but good to set)
     - `NODE_ENV`: production

5. **Configure Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `/backend`

6. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this for frontend configuration

#### Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `frontend` directory as root

3. **Configure Settings**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL`: Your Railway backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Access Your App**
   - Vercel provides URL: `https://your-app.vercel.app`

---

### Option 2: Render (Full Stack)

**Recommended for**: Single platform deployment

#### Deploy Backend

1. **Create Render Account**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: `csv-importer-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **Environment Variables**
   - Add:
     - `OPENAI_API_KEY`: Your API key
     - `NODE_ENV`: production

4. **Deploy**
   - Click "Create Web Service"
   - Note the service URL

#### Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Configure:
     - Name: `csv-importer-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `.next`

2. **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL`: Backend service URL

3. **Deploy**
   - Click "Create Static Site"

---

### Option 3: Docker + Any Cloud Provider

**Recommended for**: Maximum control, self-hosting

#### Using Docker Compose

1. **Set Environment Variables**
   ```bash
   export OPENAI_API_KEY=your_key_here
   ```

2. **Build and Run**
   ```bash
   docker-compose up --build
   ```

3. **Access**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

#### Deploy to AWS/GCP/Azure

**Using Docker images:**

1. **Build Images**
   ```bash
   # Backend
   cd backend
   docker build -t csv-importer-backend .
   
   # Frontend
   cd ../frontend
   docker build -t csv-importer-frontend .
   ```

2. **Push to Registry**
   ```bash
   # Example for Docker Hub
   docker tag csv-importer-backend username/csv-importer-backend
   docker push username/csv-importer-backend
   
   docker tag csv-importer-frontend username/csv-importer-frontend
   docker push username/csv-importer-frontend
   ```

3. **Deploy to Cloud**
   - AWS: Use ECS or Elastic Beanstalk
   - GCP: Use Cloud Run or GKE
   - Azure: Use Container Instances or AKS

---

### Option 4: Netlify (Frontend) + Heroku (Backend)

#### Deploy Backend to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create csv-importer-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set NODE_ENV=production
   ```

4. **Create Procfile** (in backend directory)
   ```
   web: npm start
   ```

5. **Deploy**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Deploy to Heroku"
   heroku git:remote -a csv-importer-backend
   git push heroku main
   ```

#### Deploy Frontend to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `NEXT_PUBLIC_API_URL`: Your Heroku backend URL

---

## Environment Variables Checklist

### Backend (.env)
```env
PORT=3001
OPENAI_API_KEY=sk-...
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## Post-Deployment Checklist

- [ ] Backend health endpoint accessible: `/api/csv/health`
- [ ] Frontend loads without errors
- [ ] File upload works
- [ ] CSV preview displays correctly
- [ ] AI processing completes successfully
- [ ] Download CSV function works
- [ ] Dark mode toggle works
- [ ] Responsive on mobile devices
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] HTTPS enabled (most platforms do this automatically)
- [ ] Error logging configured
- [ ] Monitor API usage/costs

---

## Custom Domain Setup

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway
1. Go to project settings
2. Click "Networking"
3. Add custom domain
4. Configure DNS CNAME record

### Render
1. Go to service dashboard
2. Click "Custom Domains"
3. Add domain and verify

---

## Monitoring & Logging

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to frontend `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs  # Frontend
   npm install @sentry/node     # Backend
   ```

2. **Configure** (follow Sentry setup wizard)

---

## Performance Optimization

### Frontend
1. Enable Next.js image optimization
2. Use static generation where possible
3. Enable compression
4. Configure caching headers

### Backend
1. Enable response compression:
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. Add rate limiting:
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

3. Implement caching for repeated AI requests

---

## Scaling Considerations

### For High Traffic

1. **Use CDN** for frontend assets
2. **Implement Queue System** (Redis + Bull) for CSV processing
3. **Add Load Balancer** for multiple backend instances
4. **Use Database** to store processing results
5. **Enable API Caching** for common requests
6. **Monitor API Costs** - OpenAI charges per token

### Cost Management

1. **Set API Usage Limits** in OpenAI dashboard
2. **Implement User Rate Limiting**
3. **Cache AI Responses** when possible
4. **Use cheaper model** (gpt-4o-mini vs gpt-4o)
5. **Batch Processing** to reduce API calls

---

## Troubleshooting Deployment

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors
- Ensure TypeScript compiles locally

### Runtime Errors
- Verify environment variables are set
- Check CORS configuration
- Verify API keys are valid
- Check platform logs

### CORS Issues
Backend should have:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### File Upload Issues
- Check file size limits on platform
- Verify multer configuration
- Check platform temporary directory access

---

## Security Best Practices

1. **Never commit** `.env` files
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (most platforms do automatically)
4. **Validate file uploads** server-side
5. **Implement rate limiting**
6. **Add authentication** for production use
7. **Sanitize user inputs**
8. **Keep dependencies updated**

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Backup & Recovery

1. **Database Backups** (if using database)
2. **Configuration Backups**
3. **Regular Testing** of restore procedures
4. **Version Control** for all code

---

## Support & Monitoring

### Set Up Alerts
- API error rate
- Response time
- OpenAI API costs
- Server health

### Monitoring Tools
- Vercel Analytics
- Railway Metrics
- Sentry for errors
- OpenAI Usage Dashboard

---

## Next Steps After Deployment

1. Test all functionality in production
2. Set up monitoring and alerts
3. Configure custom domain
4. Enable analytics
5. Add authentication if needed
6. Implement user feedback mechanism
7. Plan for scaling
8. Document API for team

---

## Getting Help

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/support
- **Render**: https://render.com/docs
- **OpenAI**: https://help.openai.com

---

## Estimated Costs

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 free credit/month
- **Render**: 750 hours/month
- **OpenAI**: Pay per use (no free tier for GPT-4)

### Estimated Monthly Costs (Low Traffic)
- Frontend Hosting: $0-20
- Backend Hosting: $5-25
- OpenAI API: $10-50 (varies with usage)
- **Total**: ~$15-95/month

For higher traffic, costs will scale accordingly.
