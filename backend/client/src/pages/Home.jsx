import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css' // Create this CSS file

const Home = () => {
  return (
    <div className="auth-container" id ="home-container">
      <div className="auth-card" id="home-card">
        <h1 className="auth-title">🚀 Welcome to Delivery Tracker</h1>
        
        <div className="home-content">
          <p className="home-text">
            Track your packages in real-time with our intuitive delivery tracking system.
          </p>
          
          <div className="feature-grid" id ="features">
            <div className="feature-card">
              <h3>📦 Real-Time Tracking</h3>
              <p>Monitor your deliveries live on an interactive map</p>
            </div>
            
            <div className="feature-card">
              <h3>🔔 Notifications</h3>
              <p>Get instant updates about your package status</p>
            </div>
            
            <div className="feature-card">
              <h3>📱 Multi-Platform</h3>
              <p>Access your tracking information anywhere</p>
            </div>
          </div>

          <div className="auth-actions">
            <Link to="/register" className="auth-button">
              Get Started
            </Link>
            <Link to="/login" className="auth-link">
              Existing User? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home