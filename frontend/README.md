# Frontend Documentation

React-based frontend for the Jalapeno Business blog platform.

## Overview

Modern, responsive React application with:
- JWT authentication
- Rich text editing (Quill)
- Media players (audio/video)
- Responsive design
- Toast notifications

## Tech Stack

- **React** 18
- **React Router** v6
- **Axios** for API calls
- **React Quill** for rich text editing
- **React Toastify** for notifications
- **JWT Decode** for token handling

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AudioPlayer.js   # Custom audio player
│   ├── VideoPlayer.js   # Custom video player
│   ├── Navbar.js        # Navigation component
│   ├── PostCard.js      # Blog post card
│   └── ProtectedRoute.js # Auth route wrapper
├── context/
│   └── AuthContext.js   # Authentication context/state
├── pages/               # Page components
│   ├── Home.js          # Landing page
│   ├── Blog.js          # Blog listing
│   ├── PostDetail.js    # Single post view
│   ├── Login.js         # Login page
│   ├── AdminDashboard.js # Admin panel
│   └── PostEditor.js    # Create/edit posts
├── styles/              # CSS modules
├── utils/
│   ├── api.js           # API helper functions
│   └── helpers.js       # Utility functions
├── App.js               # Main app component
└── index.js             # Entry point
```

## Installation

```bash
npm install
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner.

## Authentication

The app uses Context API for authentication state management:

```javascript
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);

  // Use authentication state and methods
}
```

### Protected Routes

Wrap any route that requires authentication:

```javascript
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## API Integration

API functions are centralized in `src/utils/api.js`:

```javascript
import { postsAPI } from './utils/api';

// Get posts
const response = await postsAPI.getAll({ page: 1, limit: 10 });

// Create post
const formData = new FormData();
formData.append('title', 'Post Title');
formData.append('content', 'Content...');
const response = await postsAPI.create(formData);
```

## Components

### AudioPlayer

Custom audio player with controls:

```javascript
import AudioPlayer from './components/AudioPlayer';

<AudioPlayer
  src="/path/to/audio.mp3"
  title="Episode Title"
/>
```

Features:
- Play/Pause
- Time scrubbing
- Volume control
- Current time display
- Duration display

### VideoPlayer

HTML5 video player wrapper:

```javascript
import VideoPlayer from './components/VideoPlayer';

<VideoPlayer
  src="/path/to/video.mp4"
  poster="/path/to/thumbnail.jpg"
/>
```

Features:
- Native video controls
- Fullscreen support
- Responsive sizing

### PostCard

Blog post preview card:

```javascript
import PostCard from './components/PostCard';

<PostCard post={postObject} />
```

Displays:
- Thumbnail image
- Title and excerpt
- Author and date
- Category badge
- Tags
- Media indicators

### Navbar

Main navigation component with:
- Logo/branding
- Navigation links
- User info (when logged in)
- Logout button

## Styling

### CSS Variables

Global CSS variables in `src/styles/index.css`:

```css
:root {
  --primary-color: #d32f2f;
  --secondary-color: #ff6f00;
  --dark-bg: #1a1a1a;
  --light-bg: #f5f5f5;
  /* ... more variables */
}
```

### Responsive Breakpoints

Mobile-first approach with breakpoint at 768px:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Pages

### Home Page
- Hero section with CTA
- Features grid
- Call-to-action section

### Blog Page
- Search functionality
- Category filters
- Post grid
- Pagination

### Post Detail Page
- Full post content
- Author info
- Media players (audio/video)
- Related metadata

### Admin Dashboard
- Post management table
- Status filters
- Quick actions (edit/delete/view)
- Create new post button

### Post Editor
- Rich text editor (Quill)
- Media upload fields
- Category and tags input
- Draft/publish options
- Image preview

## Helper Functions

Located in `src/utils/helpers.js`:

```javascript
import { formatDate, getFileUrl, createExcerpt } from './utils/helpers';

// Format dates
const formatted = formatDate('2024-01-01'); // "January 1, 2024"

// Get file URLs
const url = getFileUrl('uploads/images/photo.jpg');

// Create excerpts from HTML
const excerpt = createExcerpt(htmlContent, 150);
```

## Environment Configuration

The app uses a proxy in development (configured in `package.json`):

```json
"proxy": "http://localhost:5000"
```

For production, update API calls to use absolute URLs.

## State Management

Uses React Context API for global state:

- **AuthContext**: Authentication state
  - Current user
  - Authentication status
  - Login/logout functions

## Notifications

Toast notifications using React Toastify:

```javascript
import { toast } from 'react-toastify';

toast.success('Success message!');
toast.error('Error message!');
toast.info('Info message!');
```

## Rich Text Editor

React Quill configuration in `PostEditor.js`:

```javascript
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment Options

**Static Hosting (Netlify, Vercel):**
1. Build the app
2. Deploy the `build` folder
3. Configure redirects for SPA routing

**Example `_redirects` file for Netlify:**
```
/*    /index.html   200
```

**Server-based Hosting:**
1. Build the app
2. Serve the `build` folder with a static file server
3. Configure server for SPA routing

### Environment Variables

For production, you may need to:
1. Remove the proxy from `package.json`
2. Use absolute URLs for API calls
3. Set production API URL in environment variable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Code splitting (React.lazy)
- Image lazy loading
- Memoization (React.memo, useMemo)
- Optimized re-renders
- Compressed assets in production

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Alt text for images
- Focus management

## Development Tips

### Hot Module Replacement
Changes automatically reload in development mode.

### Console Errors
Check browser console for errors and warnings.

### React DevTools
Use React DevTools browser extension for debugging.

### Network Tab
Monitor API calls in browser Network tab.

## Customization

### Change Branding

**Logo/Name** (`components/Navbar.js`):
```javascript
<Link to="/" className="navbar-logo">
  <span className="logo-icon">🌶️</span>
  Your Brand Name
</Link>
```

**Colors** (`styles/index.css`):
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

**Meta Tags** (`public/index.html`):
```html
<title>Your Site Title</title>
<meta name="description" content="Your description" />
```

## Troubleshooting

**White screen on load:**
- Check console for errors
- Verify API backend is running
- Check network requests

**Authentication issues:**
- Clear localStorage
- Check token expiration
- Verify backend JWT secret

**File upload not working:**
- Check file size limits
- Verify file types
- Check backend upload endpoint

**Styling issues:**
- Clear browser cache
- Check CSS imports
- Verify class names

## Contributing

When adding new features:
1. Create reusable components
2. Follow existing code style
3. Add responsive styles
4. Test on multiple browsers
5. Update documentation
