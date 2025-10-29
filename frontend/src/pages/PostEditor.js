import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postsAPI } from '../utils/api';
import '../styles/PostEditor.css';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    audio: null
  });

  const [previews, setPreviews] = useState({
    thumbnail: null,
    video: null,
    audio: null
  });

  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const response = await postsAPI.getById(id);
      const post = response.data;

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category || '',
        tags: post.tags ? post.tags.join(', ') : '',
        status: post.status
      });

      // Set existing file previews
      if (post.thumbnail?.path) {
        setPreviews(prev => ({
          ...prev,
          thumbnail: `/${post.thumbnail.path}`
        }));
      }

      if (post.media?.video?.path) {
        setPreviews(prev => ({
          ...prev,
          video: `/${post.media.video.path}`
        }));
      }

      if (post.media?.audio?.path) {
        setPreviews(prev => ({
          ...prev,
          audio: `/${post.media.audio.path}`
        }));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/admin');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);

      // Handle tags
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagsArray.forEach(tag => {
          submitData.append('tags[]', tag);
        });
      }

      // Handle file uploads
      if (files.thumbnail) {
        submitData.append('thumbnail', files.thumbnail);
      }
      if (files.video) {
        submitData.append('video', files.video);
      }
      if (files.audio) {
        submitData.append('audio', files.audio);
      }

      let response;
      if (isEditMode) {
        response = await postsAPI.update(id, submitData);
        toast.success('Post updated successfully!');
      } else {
        response = await postsAPI.create(submitData);
        toast.success('Post created successfully!');
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  if (loadingPost) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="post-editor">
      <div className="editor-header">
        <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter post title"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Business, Marketing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., podcast, interview, startup"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt (Optional)</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief summary of the post"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={quillModules}
            placeholder="Write your post content here..."
          />
        </div>

        <div className="media-uploads">
          <h3>Media Files</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail Image</label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
              />
              {previews.thumbnail && (
                <div className="file-preview">
                  <img src={previews.thumbnail} alt="Thumbnail preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="video">Video</label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
              />
              {previews.video && (
                <div className="file-preview">
                  <video src={previews.video} controls />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="audio">Audio (Podcast Episode)</label>
              <input
                type="file"
                id="audio"
                accept="audio/*"
                onChange={(e) => handleFileChange(e, 'audio')}
              />
              {previews.audio && (
                <div className="file-preview">
                  <audio src={previews.audio} controls />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
