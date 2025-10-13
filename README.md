# Contact Form Deployment Guide

## Environment Variables Required

Create a `.env` file in your project root with the following variables:

```env
# Gmail OAuth2 Configuration
CLIENT_ID=your_google_client_id_here
CLIENT_SECRET=your_google_client_secret_here
REDIRECT_URI=https://developers.google.com/oauthplayground

# Gmail Account Details
EMAIL=your_gmail_address@gmail.com
REFRESH_TOKEN=your_refresh_token_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Deployment Instructions

### 1. GitHub Pages (Frontend)
- Push your code to GitHub
- Go to repository Settings > Pages
- Select "Deploy from a branch" and choose "main" branch
- Your site will be available at: `https://yourusername.github.io/your-repo-name`

### 2. Render (Backend)
- Connect your GitHub repository to Render
- Create a new Web Service
- Use these settings:
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Environment**: Node
- Add all environment variables from your `.env` file
- Deploy!

### 3. Update Frontend URL
After deploying to Render, update the API URL in `index.html`:
```javascript
const response = await fetch('https://your-app-name.onrender.com/send', {
```

## Important Notes
- Make sure your Gmail OAuth2 credentials are properly configured
- The CORS settings allow requests from GitHub Pages domain
- Render provides a free tier with automatic sleep/wake functionality
