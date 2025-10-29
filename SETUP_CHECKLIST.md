# Setup & Verification Checklist

Use this checklist to ensure your Jalapeno Business blog platform is set up correctly.

## Pre-Setup Checklist

- [ ] Node.js v14+ installed
- [ ] npm or yarn installed
- [ ] MongoDB installed (local) or MongoDB Atlas account created
- [ ] Code editor installed (VS Code recommended)
- [ ] Git installed (optional but recommended)

## Backend Setup Checklist

### Initial Setup
- [ ] Navigate to `backend` directory
- [ ] Run `npm install` successfully
- [ ] Copy `.env.example` to `.env`
- [ ] Update `MONGODB_URI` in `.env`
- [ ] Update `JWT_SECRET` in `.env` (use random string)
- [ ] Update `ADMIN_EMAIL` in `.env`
- [ ] Update `ADMIN_PASSWORD` in `.env`
- [ ] All upload directories exist: `uploads/images`, `uploads/videos`, `uploads/audio`

### Database Setup
- [ ] MongoDB service is running
- [ ] Can connect to MongoDB (check connection string)
- [ ] Run `node src/utils/seedAdmin.js` successfully
- [ ] Admin user created in database

### Server Start
- [ ] Run `npm run dev` successfully
- [ ] Server starts without errors
- [ ] See "MongoDB Connected" message
- [ ] Server running on port 5000
- [ ] Health check works: http://localhost:5000/api/health

### Backend Testing
- [ ] Can access API at http://localhost:5000/api
- [ ] Login endpoint works: POST to `/api/auth/login`
- [ ] Can get posts: GET `/api/posts`
- [ ] CORS is configured correctly
- [ ] No console errors

## Frontend Setup Checklist

### Initial Setup
- [ ] Navigate to `frontend` directory
- [ ] Run `npm install` successfully
- [ ] No dependency errors
- [ ] `package.json` proxy is set to backend URL

### Development Start
- [ ] Run `npm start` successfully
- [ ] Browser opens automatically to http://localhost:3000
- [ ] No compilation errors
- [ ] Homepage loads correctly
- [ ] No console errors in browser

### Frontend Testing
- [ ] Homepage renders correctly
- [ ] Navigation bar appears
- [ ] Can click on navigation links
- [ ] Blog page loads
- [ ] Login page loads
- [ ] No 404 errors in console
- [ ] API requests reach backend (check Network tab)

## Functional Testing Checklist

### Authentication Flow
- [ ] Navigate to http://localhost:3000/login
- [ ] Enter admin credentials
- [ ] Click Login button
- [ ] Login successful (redirects to /admin)
- [ ] User name appears in navbar
- [ ] Logout button visible
- [ ] Can logout and return to homepage

### Create Post Flow
- [ ] Login as admin
- [ ] Click "Create New Post" or navigate to `/admin/posts/new`
- [ ] Post editor loads
- [ ] Rich text editor appears
- [ ] Can type in title field
- [ ] Can type in content editor
- [ ] Can add category
- [ ] Can add tags (comma-separated)
- [ ] Can select status (draft/published)

### Image Upload
- [ ] Click on thumbnail file input
- [ ] Select an image file
- [ ] Image preview appears
- [ ] Image is under 50MB
- [ ] Image format is supported (JPEG, PNG, GIF, WebP)

### Video Upload
- [ ] Click on video file input
- [ ] Select a video file
- [ ] Video preview appears
- [ ] Video is under 50MB
- [ ] Video format is supported (MP4, WebM)

### Audio Upload
- [ ] Click on audio file input
- [ ] Select an audio file (podcast episode)
- [ ] Audio preview appears
- [ ] Audio is under 50MB
- [ ] Audio format is supported (MP3, WAV, OGG)

### Save Post
- [ ] Fill in all required fields (title, content)
- [ ] Click "Create Post" button
- [ ] Success message appears
- [ ] Redirects to admin dashboard
- [ ] New post appears in list

### Admin Dashboard
- [ ] Dashboard shows list of posts
- [ ] Can see post title, status, category
- [ ] Can filter by "All", "Published", "Drafts"
- [ ] Can see post statistics (views, date)
- [ ] Media indicators show for posts with media
- [ ] Edit button visible for each post
- [ ] Delete button visible for each post
- [ ] View button visible for each post

### Edit Post
- [ ] Click edit button on a post
- [ ] Editor loads with existing data
- [ ] All fields populated correctly
- [ ] Existing images show preview
- [ ] Can modify title
- [ ] Can modify content
- [ ] Can change status
- [ ] Click "Update Post"
- [ ] Success message appears
- [ ] Changes saved correctly

### Delete Post
- [ ] Click delete button on a post
- [ ] Confirmation dialog appears
- [ ] Click confirm
- [ ] Post removed from list
- [ ] Success message appears
- [ ] Post no longer accessible

### Public Blog View
- [ ] Logout (if logged in)
- [ ] Navigate to `/blog`
- [ ] Published posts display
- [ ] Post cards show thumbnails
- [ ] Post cards show title and excerpt
- [ ] Post cards show author and date
- [ ] Draft posts NOT visible

### Search & Filter
- [ ] On blog page, enter search term
- [ ] Click Search button
- [ ] Results filter by search term
- [ ] Click category filter button
- [ ] Posts filter by category
- [ ] Can reset filters by selecting "All"

### View Single Post
- [ ] Click on a post card
- [ ] Post detail page loads
- [ ] Full content displays
- [ ] Thumbnail image shows (if exists)
- [ ] Author name shows
- [ ] Date shows
- [ ] Tags display
- [ ] Category displays
- [ ] View counter increments

### Media Players
- [ ] View post with audio file
- [ ] Audio player appears
- [ ] Can click play button
- [ ] Audio plays correctly
- [ ] Can pause audio
- [ ] Can scrub timeline
- [ ] Can adjust volume
- [ ] Time displays correctly

- [ ] View post with video file
- [ ] Video player appears
- [ ] Can click play button
- [ ] Video plays correctly
- [ ] Can pause video
- [ ] Can use native controls
- [ ] Can fullscreen video

### Responsive Design
- [ ] Open browser DevTools
- [ ] Toggle device toolbar (mobile view)
- [ ] Homepage looks good on mobile
- [ ] Blog page looks good on mobile
- [ ] Post detail looks good on mobile
- [ ] Admin dashboard is usable on mobile
- [ ] Post editor is usable on tablet
- [ ] Navigation menu works on mobile

## Error Handling Checklist

### Backend Errors
- [ ] Try login with wrong password → Error message
- [ ] Try creating post without title → Validation error
- [ ] Try uploading file over 50MB → Size error
- [ ] Try uploading unsupported file type → Type error
- [ ] Try accessing protected route without token → 401 error

### Frontend Errors
- [ ] Try accessing /admin without login → Redirects to login
- [ ] Backend down → Error message shows
- [ ] Network error → Toast notification shows
- [ ] Form validation works (required fields)
- [ ] File size validation works

## Performance Checklist

- [ ] Homepage loads in < 2 seconds
- [ ] Blog page loads in < 2 seconds
- [ ] Post detail loads in < 1 second
- [ ] Images load smoothly
- [ ] No lag when typing in editor
- [ ] Search is responsive
- [ ] Audio player doesn't freeze UI
- [ ] Video player doesn't freeze UI

## Security Checklist

- [ ] Cannot access admin routes without login
- [ ] JWT token stored in localStorage
- [ ] Password not visible in network requests
- [ ] Password input type is "password"
- [ ] Admin password changed from default
- [ ] `.env` file not committed to git
- [ ] `node_modules` not committed to git
- [ ] `uploads` folder not committed to git

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome - All features work
- [ ] Firefox - All features work
- [ ] Safari - All features work
- [ ] Edge - All features work
- [ ] Mobile Safari - All features work
- [ ] Chrome Mobile - All features work

## Common Issues & Solutions

### MongoDB Connection Error
**Symptom**: "MongoDB connection failed"
**Solutions**:
- Check MongoDB service is running
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist
- For Atlas: Check username/password

### Cannot Login
**Symptom**: Login fails with valid credentials
**Solutions**:
- Check backend is running
- Verify admin user was created (run seedAdmin.js)
- Check JWT_SECRET is set
- Clear browser localStorage
- Check browser console for errors

### File Upload Fails
**Symptom**: "File upload failed" error
**Solutions**:
- Check file size (must be < 50MB)
- Check file type is supported
- Verify uploads directory exists
- Check disk space
- Check backend logs

### CORS Error
**Symptom**: "CORS policy blocked" in console
**Solutions**:
- Verify backend CORS_ORIGIN matches frontend URL
- Check backend is running
- Verify proxy in frontend package.json

### Port Already in Use
**Symptom**: "Port 5000/3000 already in use"
**Solutions**:
- Kill process on that port
- Change port in .env (backend) or environment (frontend)
- Check what's using the port: `lsof -i :5000`

### Images Not Loading
**Symptom**: Broken image icons
**Solutions**:
- Check uploads directory exists
- Verify backend serves static files
- Check file paths in database
- Check browser Network tab for 404s

## Production Readiness Checklist

Before deploying to production:
- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Admin password changed from default
- [ ] Strong JWT_SECRET set
- [ ] MongoDB Atlas production database set up
- [ ] Environment variables configured for production
- [ ] CORS_ORIGIN set to production frontend URL
- [ ] SSL/HTTPS configured
- [ ] Domain name configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Documentation reviewed
- [ ] README.md updated with project-specific info

## Post-Deployment Checklist

After deploying:
- [ ] Production frontend loads
- [ ] Production backend responds
- [ ] Can login to production admin
- [ ] Can create post in production
- [ ] Can upload files in production
- [ ] Public blog works in production
- [ ] All media players work
- [ ] Mobile responsive in production
- [ ] SSL certificate valid
- [ ] No console errors in production
- [ ] Monitoring reports healthy
- [ ] Backup system tested

## Final Verification

Complete setup when:
- [ ] All checkboxes above are checked ✅
- [ ] Can perform all CRUD operations
- [ ] All media types work
- [ ] No critical errors
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Documentation read and understood

---

## Success! 🎉

If all items are checked, your Jalapeno Business blog platform is ready to use!

Next steps:
1. Create your first real blog post
2. Customize branding (logo, colors)
3. Add more content
4. Share with your audience
5. Consider deploying to production

Happy blogging! 🌶️
