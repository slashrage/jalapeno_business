import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getFileUrl, createExcerpt } from '../utils/helpers';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const thumbnailUrl = post.thumbnail?.path
    ? getFileUrl(post.thumbnail.path)
    : 'https://via.placeholder.com/400x250?text=Jalapeno+Business';

  const excerpt = post.excerpt || createExcerpt(post.content, 150);

  return (
    <div className="post-card">
      <Link to={`/blog/${post.slug}`} className="post-card-image-link">
        <img
          src={thumbnailUrl}
          alt={post.title}
          className="post-card-image"
        />
      </Link>

      <div className="post-card-content">
        {post.category && (
          <span className="post-card-category">{post.category}</span>
        )}

        <Link to={`/blog/${post.slug}`} className="post-card-title-link">
          <h3 className="post-card-title">{post.title}</h3>
        </Link>

        <p className="post-card-excerpt">{excerpt}</p>

        <div className="post-card-meta">
          <span className="post-card-author">
            {post.author?.name || 'Anonymous'}
          </span>
          <span className="post-card-date">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="post-card-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-card-media-indicators">
          {post.media?.audio && (
            <span className="media-indicator" title="Contains audio">
              🎵
            </span>
          )}
          {post.media?.video && (
            <span className="media-indicator" title="Contains video">
              🎬
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
