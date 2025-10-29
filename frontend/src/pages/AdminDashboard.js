import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { postsAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 50
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await postsAPI.getAll(params);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await postsAPI.delete(id);
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/posts/edit/${id}`);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="admin-actions">
        <Link to="/admin/posts/new" className="btn btn-primary">
          Create New Post
        </Link>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button
            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found</p>
          <Link to="/admin/posts/new" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Views</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className="post-title-cell">
                      {post.title}
                      <div className="post-indicators">
                        {post.media?.audio && <span title="Has audio">🎵</span>}
                        {post.media?.video && <span title="Has video">🎬</span>}
                        {post.thumbnail && <span title="Has thumbnail">🖼️</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.category || '-'}</td>
                  <td>{post.views}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="btn-icon btn-view"
                        title="View"
                        target="_blank"
                      >
                        👁️
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id, post.title)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
