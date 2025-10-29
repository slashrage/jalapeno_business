# Backend API Documentation

## Overview

RESTful API built with Node.js, Express, and MongoDB for the Jalapeno Business blog platform.

## Base URL

Development: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "editor"  // optional, defaults to 'editor'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "editor",
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/auth/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Post Endpoints

#### Get All Posts (Public)
```http
GET /api/posts?page=1&limit=10&status=published&category=Business&search=keyword
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10
- `status` (optional): 'published' or 'draft'
- `category` (optional): Filter by category
- `tag` (optional): Filter by tag
- `search` (optional): Search in title and content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "Post Title",
      "slug": "post-title",
      "content": "Post content...",
      "excerpt": "Brief summary",
      "author": {
        "_id": "author_id",
        "name": "Author Name",
        "email": "author@example.com"
      },
      "status": "published",
      "thumbnail": {
        "filename": "image.jpg",
        "path": "uploads/images/image.jpg",
        "mimetype": "image/jpeg",
        "size": 123456
      },
      "media": {
        "video": {...},
        "audio": {...}
      },
      "tags": ["tag1", "tag2"],
      "category": "Business",
      "views": 100,
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Get Post by Slug (Public)
```http
GET /api/posts/slug/:slug
```

#### Get Post by ID (Protected)
```http
GET /api/posts/:id
Authorization: Bearer <token>
```

#### Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- title: "Post Title" (required)
- content: "Post content..." (required)
- excerpt: "Brief summary" (optional)
- category: "Business" (optional)
- tags[]: "tag1" (optional, can send multiple)
- status: "published" or "draft" (optional, defaults to draft)
- thumbnail: File (optional)
- video: File (optional)
- audio: File (optional)
```

#### Update Post (Protected)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: (same as create, all fields optional except those you want to update)
```

#### Delete Post (Protected)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

#### Get All Categories
```http
GET /api/posts/categories
```

**Response:**
```json
{
  "success": true,
  "data": ["Business", "Marketing", "Technology"]
}
```

#### Get All Tags
```http
GET /api/posts/tags
```

### Health Check
```http
GET /api/health
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## File Upload Specifications

### Supported File Types

**Images:**
- JPEG, JPG, PNG, GIF, WebP

**Videos:**
- MP4, MPEG, QuickTime, WebM

**Audio:**
- MP3, WAV, OGG, MP4 Audio

### File Size Limits
- Maximum file size: 50MB (configurable via `MAX_FILE_SIZE` env variable)

### File Storage
- Files are stored in `backend/uploads/` directory
- Images: `uploads/images/`
- Videos: `uploads/videos/`
- Audio: `uploads/audio/`

### Image Processing
- Images are automatically optimized using Sharp
- Resized to max width of 1200px (maintains aspect ratio)
- Compressed to 80% quality
- Converted to JPEG format

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per 10 minutes per IP address

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'editor']),
  isActive: Boolean,
  createdAt: Date
}
```

### Post Model
```javascript
{
  title: String (required),
  slug: String (unique, auto-generated),
  content: String (required),
  excerpt: String,
  author: ObjectId (ref: 'User'),
  status: String (enum: ['draft', 'published']),
  thumbnail: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  },
  media: {
    video: {...},
    audio: {...}
  },
  tags: [String],
  category: String,
  views: Number,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- JWT authentication
- Password hashing (bcrypt)
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation
- File type validation
- Error handling middleware

## Environment Variables

See `.env.example` for all available configuration options.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Create admin user
node src/utils/seedAdmin.js
```

## Testing with curl

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jalapenobusiness.com","password":"changethispassword"}'
```

### Get Posts
```bash
curl http://localhost:5000/api/posts?status=published
```

### Create Post (with authentication)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=My First Post" \
  -F "content=This is the content" \
  -F "status=published" \
  -F "thumbnail=@/path/to/image.jpg"
```
