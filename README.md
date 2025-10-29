# Jalapeno Business Podcast - Blog Platform

A complete fullstack blog and podcast platform built with Node.js, Express, React, and MongoDB. This application allows you to manage blog posts with rich media content including images, videos, and audio files - perfect for podcast episodes.

## Features

### Public Features
- **Modern Blog Interface**: Clean, responsive design for reading blog posts
- **Media Players**: Built-in audio and video players for podcast episodes
- **Search & Filter**: Search posts by keyword, filter by category or tag
- **Post Details**: Full post view with rich media content
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Secure Authentication**: JWT-based authentication system
- **Rich Text Editor**: Quill-based WYSIWYG editor for content creation
- **Media Management**: Upload and manage images, videos, and audio files
- **Post Management**: Create, edit, delete, and publish posts
- **Draft System**: Save posts as drafts before publishing
- **Categories & Tags**: Organize content with categories and tags
- **Dashboard**: View all posts with filtering options

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Sharp** for image optimization
- **Bcrypt** for password hashing

### Frontend
- **React** 18 with Hooks
- **React Router** for navigation
- **React Quill** for rich text editing
- **Axios** for API calls
- **React Toastify** for notifications

## Project Structure

```
jalapeno-blog/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── postController.js    # Post CRUD operations
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   ├── upload.js            # Multer file upload config
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Post.js              # Post schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── postRoutes.js        # Post endpoints
│   │   ├── utils/
│   │   │   ├── generateToken.js     # JWT token generation
│   │   │   ├── imageProcessor.js    # Image optimization
│   │   │   └── seedAdmin.js         # Admin user seeder
│   │   └── server.js                # Express app entry point
│   ├── uploads/                     # File upload directory
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AudioPlayer.js       # Custom audio player
    │   │   ├── VideoPlayer.js       # Custom video player
    │   │   ├── Navbar.js            # Navigation bar
    │   │   ├── PostCard.js          # Blog post card
    │   │   └── ProtectedRoute.js    # Route protection
    │   ├── context/
    │   │   └── AuthContext.js       # Authentication context
    │   ├── pages/
    │   │   ├── Home.js              # Landing page
    │   │   ├── Blog.js              # Blog listing
    │   │   ├── PostDetail.js        # Single post view
    │   │   ├── Login.js             # Login page
    │   │   ├── AdminDashboard.js    # Admin dashboard
    │   │   └── PostEditor.js        # Post create/edit
    │   ├── styles/                  # CSS files
    │   ├── utils/
    │   │   ├── api.js               # API functions
    │   │   └── helpers.js           # Helper functions
    │   ├── App.js                   # Main app component
    │   └── index.js                 # React entry point
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd jalapeno-blog/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jalapeno-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=50
ADMIN_EMAIL=admin@jalapenobusiness.com
ADMIN_PASSWORD=changethispassword
```

5. Create the admin user:
```bash
node src/utils/seedAdmin.js
```

6. Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd jalapeno-blog/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically proxy API requests to the backend.

## Usage

### First Time Login

1. Navigate to `http://localhost:3000/login`
2. Use the admin credentials from your `.env` file:
   - Email: `admin@jalapenobusiness.com`
   - Password: `changethispassword`
3. **Important**: Change the password after first login

### Creating a Blog Post

1. Log in to the admin dashboard
2. Click "Create New Post" or navigate to `/admin/posts/new`
3. Fill in the post details:
   - **Title**: Required - The post title
   - **Category**: Optional - Organize posts by category
   - **Tags**: Optional - Comma-separated tags
   - **Excerpt**: Optional - Brief summary (auto-generated if not provided)
   - **Content**: Required - Rich text content using the editor
   - **Status**: Draft or Published
4. Upload media files (optional):
   - **Thumbnail**: Post preview image
   - **Video**: Video content for the post
   - **Audio**: Podcast episode or audio content
5. Click "Create Post" to save

### Managing Posts

- View all posts in the admin dashboard at `/admin`
- Filter posts by status (All, Published, Drafts)
- Edit posts by clicking the edit icon
- Delete posts by clicking the delete icon
- View published posts by clicking the eye icon

### Public Blog

- View all published posts at `/blog`
- Search posts using the search bar
- Filter by category using the category buttons
- Click on a post to view full details
- Audio and video players will automatically appear for posts with media

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update` - Update user details (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

### Posts
- `GET /api/posts` - Get all posts (public, supports pagination & filters)
- `GET /api/posts/slug/:slug` - Get post by slug (public)
- `GET /api/posts/:id` - Get post by ID (protected)
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `GET /api/posts/categories` - Get all categories
- `GET /api/posts/tags` - Get all tags

## File Upload Limits

- Maximum file size: 50MB (configurable in `.env`)
- Supported image formats: JPEG, PNG, GIF, WebP
- Supported video formats: MP4, MPEG, QuickTime, WebM
- Supported audio formats: MP3, WAV, OGG, MP4 Audio

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection

## Performance Optimizations

- Image optimization with Sharp
- Compression middleware
- Lazy loading for images
- Efficient database queries with indexes
- React code splitting
- Memoization where needed

## Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `MONGODB_URI` to your production database
3. Change `JWT_SECRET` to a strong random string
4. Update `CORS_ORIGIN` to your frontend URL
5. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. The `build` folder will contain optimized production files
3. Update API URL in production (remove proxy, use full URL)
4. Deploy to hosting service (Netlify, Vercel, AWS S3, etc.)

### Environment Variables for Production

Backend:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-production-secret
CORS_ORIGIN=https://your-frontend-domain.com
MAX_FILE_SIZE=50
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

**File Upload Errors**
- Check file size doesn't exceed limit
- Ensure `uploads` directory exists and has write permissions
- Verify file type is supported

**Authentication Issues**
- Clear browser localStorage
- Check JWT_SECRET is set correctly
- Verify token hasn't expired

**CORS Errors**
- Ensure `CORS_ORIGIN` matches frontend URL
- Check backend is running on correct port

## Future Enhancements

Potential features to add:
- Comments system
- Social media sharing
- RSS feed for podcast
- Email newsletter integration
- Analytics dashboard
- Multi-author support
- Advanced SEO features
- Image galleries
- Related posts suggestions

## License

MIT License - Feel free to use this project for your podcast or blog!

## Support

For issues or questions, please open an issue on the project repository.

---

Built with 🌶️ for Jalapeno Business Podcast
