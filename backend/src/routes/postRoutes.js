const express = require('express');
const {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  getTags
} = require('../controllers/postController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Public routes (optionally authenticated)
router.get('/', optionalAuth, getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/categories', getCategories);
router.get('/tags', getTags);

// Protected routes (require authentication)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  handleMulterError,
  createPost
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  handleMulterError,
  updatePost
);

router.delete('/:id', protect, deletePost);
router.get('/:id', protect, getPost);

module.exports = router;
