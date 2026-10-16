import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card card-custom shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="fw-bold mb-3 text-center">🔐 Portal Login</h3>
        <p className="text-muted small text-center mb-4">Enter your credentials to continue</p>    
        {error && <div className="alert alert-danger py-2 small">{error}</div>}  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="hrithikroshan@gmail.com.com"
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-3 small">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-decoration-none fw-bold">Register here</Link>
        </div>
      </div>
    </div>
  );
}