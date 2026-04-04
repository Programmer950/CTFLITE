import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });

      // Assume data contains { token: "JWT_TOKEN" }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Redirect the user upon successful login, for example to the admin panel
        navigate('/admin');
      } else {
        setError('Login successful, but no token was provided.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        {error && <div className="auth-error" style={{ color: '#ff4444', marginBottom: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>{error}</div>}
        <div className="auth-group">
          <label className="auth-label">Username <span className="req">*</span></label>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-group">
          <label className="auth-label">Password <span className="req">*</span></label>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-actions">
          <a href="#" className="auth-link">Forgot your password?</a>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#e2e8f4' }}>
          Don't have an account? <Link to="/register" className="auth-link" style={{ fontWeight: 'bold' }}>Click here to register</Link>.
        </div>
      </form>
    </div>
  );
}
