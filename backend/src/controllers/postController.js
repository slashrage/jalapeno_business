const Post = require('../models/Post');
const { processImage } = require('../utils/imageProcessor');
const fs = require('fs').promises;
const path = require('path');

// Get all posts (public)
exports.getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      category,
      tag,
      search
    } = req.query;

    const query = { status };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single post by slug (public)
exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Get single post by ID (admin)
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Create post
exports.createPost = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    // Handle file uploads
    if (req.files) {
      // Process thumbnail
      if (req.files.thumbnail) {
        const thumbnail = req.files.thumbnail[0];
        const processed = await processImage(thumbnail.path);

        req.body.thumbnail = {
          filename: thumbnail.filename,
          path: processed.path,
          mimetype: thumbnail.mimetype,
          size: processed.size
        };
      }

      // Process video
      if (req.files.video) {
        const video = req.files.video[0];
        req.body.media = req.body.media || {};
        req.body.media.video = {
          filename: video.filename,
          path: video.path,
          mimetype: video.mimetype,
          size: video.size
        };
      }

      // Process audio
      if (req.files.audio) {
        const audio = req.files.audio[0];
        req.body.media = req.body.media || {};
        req.body.media.audio = {
          filename: audio.filename,
          path: audio.path,
          mimetype: audio.mimetype,
          size: audio.size
        };
      }
    }

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Handle file uploads
    if (req.files) {
      // Process thumbnail
      if (req.files.thumbnail) {
        // Delete old thumbnail
        if (post.thumbnail && post.thumbnail.path) {
          try {
            await fs.unlink(post.thumbnail.path);
          } catch (err) {
            console.error('Error deleting old thumbnail:', err);
          }
        }

        const thumbnail = req.files.thumbnail[0];
        const processed = await processImage(thumbnail.path);

        req.body.thumbnail = {
          filename: thumbnail.filename,
          path: processed.path,
          mimetype: thumbnail.mimetype,
          size: processed.size
        };
      }

      // Process video
      if (req.files.video) {
        // Delete old video
        if (post.media?.video?.path) {
          try {
            await fs.unlink(post.media.video.path);
          } catch (err) {
            console.error('Error deleting old video:', err);
          }
        }

        const video = req.files.video[0];
        req.body.media = req.body.media || post.media || {};
        req.body.media.video = {
          filename: video.filename,
          path: video.path,
          mimetype: video.mimetype,
          size: video.size
        };
      }

      // Process audio
      if (req.files.audio) {
        // Delete old audio
        if (post.media?.audio?.path) {
          try {
            await fs.unlink(post.media.audio.path);
          } catch (err) {
            console.error('Error deleting old audio:', err);
          }
        }

        const audio = req.files.audio[0];
        req.body.media = req.body.media || post.media || {};
        req.body.media.audio = {
          filename: audio.filename,
          path: audio.path,
          mimetype: audio.mimetype,
          size: audio.size
        };
      }
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Delete associated files
    const filesToDelete = [];

    if (post.thumbnail?.path) {
      filesToDelete.push(post.thumbnail.path);
    }

    if (post.media?.video?.path) {
      filesToDelete.push(post.media.video.path);
    }

    if (post.media?.audio?.path) {
      filesToDelete.push(post.media.audio.path);
    }

    // Delete files
    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Post.distinct('category');

    res.status(200).json({
      success: true,
      data: categories.filter(cat => cat) // Remove null/undefined
    });
  } catch (error) {
    next(error);
  }
};

// Get all tags
exports.getTags = async (req, res, next) => {
  try {
    const tags = await Post.distinct('tags');

    res.status(200).json({
      success: true,
      data: tags.filter(tag => tag) // Remove null/undefined
    });
  } catch (error) {
    next(error);
  }
};
