import React, { useState, useEffect } from 'react';

export default function ContactForm({ show, onClose, onSubmit, currentContact }) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        photo: ''
    });
    const [error, setError] = useState('');
    useEffect(() => {
        if (currentContact) {
            setFormData(currentContact);
        } else {
            setFormData({ name: '', company: '', email: '', phone: '', photo: '' });
        }
        setError('');
    }, [currentContact, show]);
    if (!show) return null;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            setError('Please fill in all mandatory fields (Name, Email, Phone).');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        onSubmit(formData);
    };
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content card-custom p-2">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold">
                            {currentContact ? '✏️ Edit Contact' : '➕ Add New Contact'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger py-2 small">{error}</div>}

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Full Name *</label>
                                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Job Title / Company</label>
                                <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} placeholder="Software Engineer / Acme Inc" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address *</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Phone Number *</label>
                                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0192" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Profile Photo URL</label>
                                <input type="text" className="form-control" name="photo" value={formData.photo} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                            </div>
                        </div>
                        <div className="modal-footer border-top-0">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm px-4">Save Contact</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}