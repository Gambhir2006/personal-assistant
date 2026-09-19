# Deployment Guide - Radhee AI Assistant

This guide will help you deploy Radhee to **Render** (backend) and **Vercel** (frontend) for free.

## Prerequisites

- GitHub account
- Render account (free)
- Vercel account (free)
- OpenAI API key (required for AI features - Ollama won't work on cloud)

## Step 1: Prepare GitHub Repository

1. Create a new GitHub repository
2. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/radhee.git
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Verify your email

### 2.2 Deploy Backend
1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: radhee-backend
   - **Region**: Oregon (or closest to you)
   - **Branch**: main
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### 2.3 Add PostgreSQL Database
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: radhee-db
   - **Database Name**: radhee
   - **User**: radhee
3. Click **"Create Database"**

### 2.4 Configure Environment Variables
1. Go to your backend service in Render
2. Click **"Environment"** tab
3. Add these variables:
   ```
   DATABASE_URL = [Get from PostgreSQL database settings]
   AI_PROVIDER = openai
   OPENAI_API_KEY = your_openai_api_key_here
   OPENAI_MODEL = gpt-4
   OPENAI_BASE_URL = https://api.openai.com/v1
   CORS_ORIGINS = https://your-frontend.vercel.app
   PORT = 8000
   ```

4. To get DATABASE_URL:
   - Go to your PostgreSQL database in Render
   - Copy the **Internal Database URL**
   - Paste it as DATABASE_URL value

### 2.5 Deploy
1. Click **"Deploy Web Service"**
2. Wait for deployment to complete (2-3 minutes)
3. Copy your backend URL: `https://radhee-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Verify your email

### 3.2 Deploy Frontend
1. Go to Vercel Dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

### 3.3 Add Environment Variable
1. In Vercel project settings, go to **"Environment Variables"**
2. Add:
   ```
   REACT_APP_API_URL = https://radhee-backend.onrender.com
   ```
   (Replace with your actual Render backend URL)

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (1-2 minutes)
3. Copy your frontend URL: `https://your-frontend.vercel.app`

## Step 4: Update CORS on Render

1. Go back to your Render backend service
2. Click **"Environment"** tab
3. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://your-frontend.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)
4. Click **"Save Changes"**
5. Render will automatically redeploy

## Step 5: Test Your Deployment

1. Open your Vercel frontend URL
2. Test all features:
   - Chat with AI
   - Create tasks
   - Create notes
   - File upload
   - Voice input

## Important Notes

### Free Tier Limitations
- **Render Free Tier**:
  - Web service sleeps after 15 minutes of inactivity
  - Takes ~30 seconds to wake up on first request
  - 512MB RAM limit
  - PostgreSQL: 90 days free, then requires credit card

- **Vercel Free Tier**:
  - Unlimited deployments
  - 100GB bandwidth per month
  - No sleep time

### OpenAI API Costs
- You need an OpenAI API key for AI features
- Ollama won't work on cloud (requires local GPU)
- OpenAI costs: ~$0.002 per 1K tokens
- Free tier: $5 credit for new accounts

### Troubleshooting

**Backend won't start:**
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure all environment variables are set

**Frontend can't connect to backend:**
- Verify CORS_ORIGINS includes your Vercel URL
- Check REACT_APP_API_URL is correct
- Ensure backend is deployed and running

**Database errors:**
- Verify PostgreSQL database is running
- Check DATABASE_URL format
- Ensure database tables are created automatically

## Local Development

To continue local development:
1. Keep using SQLite (default)
2. Keep using Ollama (if available)
3. No changes needed to local setup

## Cost Summary

**Monthly Cost (Free Tier):**
- Render Backend: $0
- Render PostgreSQL: $0 (first 90 days)
- Vercel Frontend: $0
- OpenAI API: Pay per usage (~$0.002/1K tokens)

**Total: $0/month** (plus OpenAI API usage)

## Support

If you encounter issues:
- Check Render logs: Dashboard → Service → Logs
- Check Vercel logs: Dashboard → Project → Deployments
- Verify all environment variables are set correctly
- Ensure CORS is configured properly
