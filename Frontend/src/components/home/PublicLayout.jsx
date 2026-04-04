import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './PublicLayout.css';

export default function PublicLayout() {
  return (
    <div className="public-theme">
      <nav className="public-navbar">
        <div className="public-nav-left">
          <Link to="/" className="public-brand">Test CTF</Link>
          <Link to="#" className="public-nav-link">Users</Link>
          <Link to="#" className="public-nav-link">Scoreboard</Link>
          <Link to="#" className="public-nav-link">Challenges</Link>
        </div>
        <div className="public-nav-right">
          <Link to="/register" className="public-nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Register
          </Link>
          <Link to="/login" className="public-nav-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Login
          </Link>
          <div className="public-nav-link" style={{ cursor: "pointer" }}>
            <span>A | 文</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="public-nav-link" style={{ cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </div>
        </div>
      </nav>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        Powered by CTFd
      </footer>
    </div>
  );
}
