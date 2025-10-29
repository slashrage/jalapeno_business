import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';

import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/posts/new"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/posts/edit/:id"
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="footer">
            <div className="footer-content">
              <p>&copy; 2024 Jalapeno Business Podcast. All rights reserved.</p>
            </div>
          </footer>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
