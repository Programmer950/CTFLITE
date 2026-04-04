import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const api = axios.create({
      baseURL: 'http://localhost:8080',
    });

    try {
      // Sending username and password as required, and also including email from the form
      const response = await api.post('/api/register', { username, password });

      // If the registration returns a token, log them in directly
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin');
      } else {
        // Otherwise redirect to the login page
        navigate('/login');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      );
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Register</h1>
      <form className="auth-form" onSubmit={handleRegister}>
        {error && <div className="auth-error" style={{ color: '#ff4444', marginBottom: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>{error}</div>}

        <div className="auth-group">
          <label className="auth-label">User Name <span className="req">*</span></label>
          <input
            type="text"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="auth-help">Your username on the site</div>
        </div>

        <div className="auth-group">
          <label className="auth-label">Email <span className="req">*</span></label>
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="auth-help">Never shown to the public</div>
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
          <div className="auth-help">Password used to log into your account</div>
        </div>

        <div className="auth-actions auth-actions-right">
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
