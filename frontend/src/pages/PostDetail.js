import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AudioPlayer from '../components/AudioPlayer';
import VideoPlayer from '../components/VideoPlayer';
import { postsAPI } from '../utils/api';
import { formatDate, getFileUrl } from '../utils/helpers';
import '../styles/PostDetail.css';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getBySlug(slug);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <h2>Post not found</h2>
        <Link to="/blog" className="btn btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  const thumbnailUrl = post.thumbnail?.path
    ? getFileUrl(post.thumbnail.path)
    : null;

  return (
    <article className="post-detail">
      <div className="post-detail-header">
        {post.category && (
          <span className="post-detail-category">{post.category}</span>
        )}
        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          <span className="post-detail-author">
            By {post.author?.name || 'Anonymous'}
          </span>
          <span className="post-detail-date">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="post-detail-views">
            {post.views} views
          </span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-detail-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="post-detail-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {thumbnailUrl && (
        <div className="post-detail-image">
          <img src={thumbnailUrl} alt={post.title} />
        </div>
      )}

      {post.media?.video && (
        <div className="post-detail-media">
          <VideoPlayer
            src={getFileUrl(post.media.video.path)}
            poster={thumbnailUrl}
          />
        </div>
      )}

      {post.media?.audio && (
        <div className="post-detail-media">
          <AudioPlayer
            src={getFileUrl(post.media.audio.path)}
            title={post.title}
          />
        </div>
      )}

      <div
        className="post-detail-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="post-detail-footer">
        <Link to="/blog" className="btn btn-secondary">
          Back to Blog
        </Link>
      </div>
    </article>
  );
};

export default PostDetail;
