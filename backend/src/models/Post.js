const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  thumbnail: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  },
  media: {
    video: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number
    },
    audio: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      duration: Number
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  this.updatedAt = Date.now();
  next();
});

// Update publishedAt when status changes to published
postSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  next();
});

// Create indexes for better query performance
// Note: slug index is created automatically by unique: true
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model('Post', postSchema);
