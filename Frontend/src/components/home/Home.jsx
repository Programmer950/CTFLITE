import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-ctfd-logo">
        <span className="home-ctfd-text">CTF</span>
        <svg width="100" height="120" viewBox="0 0 100 120" style={{ marginLeft: -15, zIndex: 10, position: 'relative' }}>
          <path d="M40,20 Q60,10 80,20 Q95,25 90,40 C80,60 85,55 95,65 Q80,75 60,65 Q40,55 40,65 Z" fill="#d93b3f" />
          <path d="M40,20 L40,110" stroke="#fff" strokeWidth="4" />
          <ellipse cx="40" cy="110" rx="20" ry="5" fill="#fff" opacity="0.9" />
          
          <circle cx="68" cy="45" r="15" fill="#d93b3f" />
          <circle cx="68" cy="45" r="8" fill="#fff" />
          <path d="M66,45 L66,55 L70,55 L70,45 Z" fill="#fff" />
        </svg>
      </div>

      <div className="home-login-prompt">
        <Link to="/login" className="home-link">Click here</Link> to login and setup your CTF
      </div>
    </div>
  );
}
