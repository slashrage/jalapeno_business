import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌶️</span>
          Jalapeno Business
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/blog" className="navbar-link">Blog</Link>
          </li>

          {isAuthenticated && (
            <>
              <li className="navbar-item">
                <Link to="/admin" className="navbar-link">Admin</Link>
              </li>
              <li className="navbar-item">
                <Link to="/admin/posts/new" className="navbar-link">New Post</Link>
              </li>
              <li className="navbar-item">
                <span className="navbar-user">Welcome, {user?.name}</span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-btn">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
