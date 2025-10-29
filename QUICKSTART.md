# Quick Start Guide - Jalapeno Business Blog

Get your blog up and running in 5 minutes!

## Step 1: Install MongoDB

If you don't have MongoDB installed:

### Option A: Local Installation
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS
- Start MongoDB service

### Option B: Use MongoDB Atlas (Free Cloud Database)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Whitelist your IP address

## Step 2: Backend Setup

```bash
# Navigate to backend folder
cd jalapeno-blog/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your settings
# For MongoDB Atlas, update MONGODB_URI with your connection string
nano .env  # or use any text editor

# Create admin user
node src/utils/seedAdmin.js

# Start backend server
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

## Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend folder
cd jalapeno-blog/frontend

# Install dependencies
npm install

# Start frontend server
npm start
```

Your browser should automatically open to `http://localhost:3000`

## Step 4: Login & Create Your First Post

1. Go to `http://localhost:3000/login`
2. Login with default credentials:
   - Email: `admin@jalapenobusiness.com`
   - Password: `changethispassword`
3. Click "Create New Post"
4. Fill in the details and click "Create Post"
5. View your post on the blog!

## Step 5: Customize (Optional)

### Change Admin Password
1. Login to admin dashboard
2. Navigate to profile settings
3. Update password

### Update Branding
- Edit the logo/name in `frontend/src/components/Navbar.js`
- Customize colors in `frontend/src/styles/index.css` (CSS variables)
- Update meta tags in `frontend/public/index.html`

## Troubleshooting

**Backend won't start?**
- Make sure MongoDB is running
- Check port 5000 isn't already in use
- Verify .env file exists and has correct values

**Frontend won't start?**
- Check port 3000 isn't already in use
- Try deleting node_modules and running `npm install` again

**Can't login?**
- Make sure you ran the seedAdmin.js script
- Check backend console for errors
- Clear browser cache/localStorage

**File uploads not working?**
- Check uploads folder exists: `backend/uploads/{images,videos,audio}`
- Verify folder has write permissions

## Default Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: mongodb://localhost:27017 (if local)

## Next Steps

- Read the full README.md for detailed documentation
- Explore the admin dashboard features
- Create multiple posts with different media types
- Customize the styling to match your brand
- Deploy to production when ready

## Quick Commands Reference

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
node src/utils/seedAdmin.js  # Create admin user
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
```

## Need Help?

- Check README.md for full documentation
- Review the project structure
- Check console logs for error messages

Happy blogging! 🌶️
