import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    try {
      await register({ name, email, password });
      setSuccessMessage('🎉 Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch {
      setSubmitting(false); 
    }
  };
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card card-custom shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="fw-bold mb-3 text-center">📝 Create Account</h3>
        <p className="text-muted small text-center mb-4">Register to access your contact dashboard</p>  
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {successMessage && <div className="alert alert-success py-2 small fw-bold">{successMessage}</div>}  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Rahul Sharma"
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="rahul@example.com"
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
          <button type="submit" className="btn btn-primary w-100 mt-2" disabled={submitting || successMessage}>
            {submitting && !successMessage ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-3 small">
          <span>Already have an account? </span>
          <Link to="/login" className="text-decoration-none fw-bold">Login here</Link>
        </div>
      </div>
    </div>
  );
}