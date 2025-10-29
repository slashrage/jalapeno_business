import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import { postsAPI } from '../utils/api';
import '../styles/Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [page, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        status: 'published'
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await postsAPI.getAll(params);
      setPosts(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await postsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="blog">
      <div className="blog-header">
        <h1>Blog Posts</h1>
        <p>Explore our latest articles and podcast episodes</p>
      </div>

      <div className="blog-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        <div className="category-filters">
          <button
            className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
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
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
