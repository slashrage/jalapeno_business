# Deployment Guide

Complete guide for deploying the Jalapeno Business blog platform to production.

## Pre-Deployment Checklist

- [ ] Test application thoroughly in development
- [ ] Set up production MongoDB database
- [ ] Prepare production environment variables
- [ ] Choose hosting platforms
- [ ] Set up domain name (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategy

## Deployment Options

### Option 1: All-in-One Platform (Easiest)

Deploy both frontend and backend on the same platform.

**Recommended Platforms:**
- Heroku
- Railway
- Render
- DigitalOcean App Platform

### Option 2: Separate Hosting (Recommended)

- **Backend**: Heroku, Railway, DigitalOcean, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas (free tier available)

## Database Setup (MongoDB Atlas)

### Step 1: Create Account & Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Sandbox - Free)
4. Wait for cluster to be provisioned (2-5 minutes)

### Step 2: Configure Access

1. **Database Access**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `jalapeno-blog-user`
   - Password: Generate secure password (save this!)
   - User Privileges: "Read and write to any database"

2. **Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is fine for development; restrict in production

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `jalapeno-blog`

Example:
```
mongodb+srv://jalapeno-blog-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/jalapeno-blog?retryWrites=true&w=majority
```

## Backend Deployment

### Deploying to Heroku

#### Step 1: Prepare Backend

1. Ensure `backend/package.json` has correct start script:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

2. Create `backend/Procfile`:
```
web: node src/server.js
```

#### Step 2: Deploy

```bash
# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Navigate to backend directory
cd backend

# Create Heroku app
heroku create jalapeno-blog-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-strong-random-secret-key"
heroku config:set JWT_EXPIRE=7d
heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
heroku config:set MAX_FILE_SIZE=50
heroku config:set ADMIN_EMAIL="admin@jalapenobusiness.com"
heroku config:set ADMIN_PASSWORD="change-this-secure-password"

# Deploy
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a jalapeno-blog-api
git push heroku main

# Create admin user
heroku run node src/utils/seedAdmin.js
```

Your backend will be available at: `https://jalapeno-blog-api.herokuapp.com`

### Deploying to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your backend repository
6. Add environment variables in Railway dashboard
7. Railway will auto-deploy

### Deploying to DigitalOcean

1. Create a Droplet (Ubuntu 22.04)
2. SSH into server
3. Install Node.js, MongoDB, and Nginx
4. Clone repository
5. Set up environment variables
6. Run with PM2 for process management
7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

## Frontend Deployment

### Deploying to Vercel

#### Step 1: Prepare Frontend

1. Update API calls to use production backend URL

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://jalapeno-blog-api.herokuapp.com
```

Update `frontend/src/utils/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

2. Build to test:
```bash
cd frontend
npm run build
```

#### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? jalapeno-blog
# - In which directory is your code located? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

Alternatively, connect GitHub repository in Vercel dashboard for automatic deployments.

### Deploying to Netlify

#### Option A: Drag and Drop

1. Build your frontend:
```bash
cd frontend
npm run build
```

2. Go to [netlify.com](https://www.netlify.com)
3. Drag the `build` folder to Netlify

#### Option B: Git Integration (Recommended)

1. Push frontend to GitHub
2. Connect repository in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Add `_redirects` file in `public` folder:
```
/*    /index.html   200
```

### Deploying to AWS S3 + CloudFront

1. Build frontend: `npm run build`
2. Create S3 bucket with static website hosting
3. Upload `build` folder contents to S3
4. Create CloudFront distribution
5. Point CloudFront to S3 bucket
6. Configure error pages for SPA routing
7. Set up Route 53 for custom domain (optional)

## Environment Variables

### Backend Production Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jalapeno-blog
JWT_SECRET=your-super-secret-random-string-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
MAX_FILE_SIZE=50
ADMIN_EMAIL=admin@jalapenobusiness.com
ADMIN_PASSWORD=your-secure-password
```

**IMPORTANT:**
- Generate a strong JWT_SECRET (random 32+ characters)
- Use a secure ADMIN_PASSWORD
- Never commit `.env` files to version control

### Frontend Production Variables

```env
REACT_APP_API_URL=https://your-backend-domain.com
```

## SSL/HTTPS Setup

### Free SSL with Let's Encrypt

Most modern hosting platforms (Heroku, Vercel, Netlify) provide automatic SSL.

For custom servers:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already set up by certbot)
```

## Domain Configuration

### Connect Custom Domain

1. **Purchase domain** (Namecheap, Google Domains, etc.)

2. **For Heroku Backend**:
   - Add custom domain in Heroku dashboard
   - Update DNS records with CNAME

3. **For Vercel/Netlify Frontend**:
   - Add custom domain in platform dashboard
   - Update DNS records as instructed

Example DNS Records:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     your-app.vercel.app
```

## Post-Deployment Steps

### 1. Create Admin User

```bash
# If using Heroku
heroku run node src/utils/seedAdmin.js -a jalapeno-blog-api

# If using Railway
railway run node src/utils/seedAdmin.js

# If using custom server
ssh into server
cd /path/to/app/backend
node src/utils/seedAdmin.js
```

### 2. Update CORS Settings

Ensure backend CORS_ORIGIN matches your frontend URL:
```env
CORS_ORIGIN=https://jalapenobusiness.com
```

### 3. Test Everything

- [ ] Can access frontend
- [ ] Can login with admin credentials
- [ ] Can create new post
- [ ] Can upload images
- [ ] Can upload audio files
- [ ] Can upload video files
- [ ] Public blog page loads
- [ ] Individual post pages load
- [ ] Media players work
- [ ] Search functionality works
- [ ] Mobile responsive
- [ ] SSL certificate active

### 4. Update Admin Password

1. Login with default credentials
2. Change password immediately
3. Update environment variable if needed

### 5. Monitor Application

Set up monitoring:
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Analytics (Google Analytics)

## File Upload Configuration

### Production File Storage Options

#### Option 1: Local Storage (Default)
Files stored on server filesystem. Works for small-scale deployments.

**Pros:** Simple, no additional cost
**Cons:** Lost on server restart (Heroku), not scalable

#### Option 2: AWS S3 (Recommended for Production)

1. Create S3 bucket
2. Install AWS SDK: `npm install aws-sdk`
3. Update upload middleware to use S3
4. Store S3 credentials in environment variables

#### Option 3: Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Install SDK: `npm install cloudinary`
3. Update upload logic
4. Great for image/video optimization

## Backup Strategy

### Database Backups

MongoDB Atlas provides automatic backups in paid tiers.

For manual backups:
```bash
# Backup
mongodump --uri="your-mongodb-connection-string"

# Restore
mongorestore --uri="your-mongodb-connection-string" /path/to/backup
```

### Code Backups

- Use Git for version control
- Push to GitHub/GitLab regularly
- Use branching strategy (main, develop, feature branches)

### Media Backups

- Regular backups of uploads folder
- Use cloud storage (S3, Cloudinary)
- Automated backup scripts

## Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Multiple backend instances
- Shared file storage (S3)
- Database replication

### Performance Optimization
- Enable Redis caching
- CDN for static assets
- Image optimization service
- Lazy loading
- Code splitting

## Monitoring & Maintenance

### Health Checks

Backend health endpoint: `GET /api/health`

Set up monitoring:
- UptimeRobot (free)
- Pingdom
- StatusCake

### Log Management

- Heroku logs: `heroku logs --tail`
- Papertrail (log aggregation)
- Loggly
- Datadog

### Error Tracking

Integrate Sentry:
```bash
npm install @sentry/node
```

Backend integration:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
```

## Troubleshooting

### Backend Won't Start
- Check environment variables
- Verify MongoDB connection
- Check logs for errors
- Ensure port is available

### Frontend Shows API Errors
- Verify backend URL is correct
- Check CORS settings
- Inspect network requests
- Check backend logs

### File Uploads Failing
- Check file size limits
- Verify storage configuration
- Check disk space
- Review upload permissions

### Authentication Issues
- Verify JWT_SECRET matches
- Check token expiration
- Clear browser localStorage
- Regenerate tokens

## Cost Estimation

### Free Tier (Perfect for Starting)
- **MongoDB Atlas**: Free (512MB storage)
- **Heroku**: Free dyno (sleeps after 30 min inactivity)
- **Netlify/Vercel**: Free (100GB bandwidth)
- **Total**: $0/month

### Recommended Production Setup
- **MongoDB Atlas**: M2 cluster (~$9/month)
- **Heroku**: Hobby dyno ($7/month)
- **Vercel/Netlify**: Pro plan (~$20/month for high traffic)
- **Domain**: ~$12/year
- **Cloudinary**: Free tier (10GB storage)
- **Total**: ~$16-36/month + domain

### High-Traffic Setup
- **MongoDB Atlas**: M10+ cluster ($57+/month)
- **AWS EC2/DigitalOcean**: Droplet ($20-100/month)
- **AWS S3**: Pay per use (~$5-20/month)
- **CloudFront CDN**: Pay per use (~$10-50/month)
- **Total**: $92-227/month+

## Security Best Practices

- [ ] Use HTTPS everywhere
- [ ] Keep dependencies updated
- [ ] Use strong passwords
- [ ] Enable rate limiting
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Regular security audits
- [ ] Backup regularly
- [ ] Monitor for suspicious activity
- [ ] Use environment variables for secrets
- [ ] Implement proper error handling
- [ ] Set up firewall rules

## Updates & Maintenance

### Updating Application

```bash
# Pull latest changes
git pull origin main

# Backend updates
cd backend
npm install
# Restart server

# Frontend updates
cd frontend
npm install
npm run build
# Deploy new build
```

### Database Migrations

When schema changes:
1. Create migration script
2. Test on development database
3. Backup production database
4. Run migration on production
5. Verify data integrity

## Support & Resources

- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Heroku Docs: [devcenter.heroku.com](https://devcenter.heroku.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)

## Success Criteria

Your deployment is successful when:
- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Can login and access admin panel
- [ ] Can create and publish posts
- [ ] Can upload all media types
- [ ] Public blog displays posts correctly
- [ ] Media players work properly
- [ ] Mobile responsive
- [ ] SSL/HTTPS active
- [ ] Admin password changed
- [ ] Monitoring set up
- [ ] Backups configured

---

Congratulations on deploying your blog! 🌶️
