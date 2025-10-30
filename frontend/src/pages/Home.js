import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-primary">
              Explore Blog
            </Link>
            <a
              href="#about"
              className="btn btn-secondary"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section className="features" id="about">
        <div className="features-container">
          <h2 className="features-title">What We Offer</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Blog Posts</h3>
              <p>
                In-depth articles covering business strategies, entrepreneurship,
                and industry insights.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎙️</div>
              <h3>Podcast Episodes</h3>
              <p>
                Listen to interviews with successful entrepreneurs and business
                leaders sharing their experiences.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Video Content</h3>
              <p>
                Watch exclusive video content, tutorials, and behind-the-scenes
                footage from our episodes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Business Tips</h3>
              <p>
                Practical advice and actionable tips to help you grow your
                business and achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Spice Up Your Business?</h2>
          <p>
            Join our community and get access to exclusive content, insights, and
            resources.
          </p>
          <Link to="/blog" className="btn btn-primary btn-large">
            Start Reading
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
