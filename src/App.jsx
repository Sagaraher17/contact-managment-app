import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import ProtectedRoute from './routes/ProtectedRoute';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ContactCard from './components/ContactCard';
import ContactDelete from './components/ContactDelete';
import ContactLoader from './components/PaginationLoader';
import Login from './pages/Login';
import Register from './pages/Register';

function Layout() {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
            <nav className="navbar navbar-expand-lg navbar-custom px-4 py-3 shadow-sm sticky-top">
                <div className="container-fluid">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="btn btn-outline-primary btn-sm fw-semibold"
                            onClick={() => window.location.href = '/dashboard'}
                            title="Go to Home Dashboard"
                        >
                            🏠 Home
                        </button>
                        <span className="navbar-brand fw-bold fs-4 mb-0" style={{ color: 'var(--text-color)' }}>
                            Contact Manager <span className="fs-6 fw-normal text-muted">({user?.name})</span>
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-3 ms-auto">
                        <button
                            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '36px', height: '36px' }}
                            onClick={toggleTheme}
                            title="Toggle Theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm text-nowrap"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <Routes>
                    <Route path="" element={<DashboardContent />} />
                    <Route path="add" element={<ContactFormPage />} />
                    <Route path="edit/:id" element={<ContactFormPage />} />
                    <Route path="view/:id" element={<ContactViewPage />} />
                </Routes>
            </div>
        </div>
    );
}
function DashboardContent() {
    const [contacts, setContacts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchContacts();
    }, []);
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts.", error);
        } finally {
            setLoading(false);
        }
    };
    const handleToggleFavorite = async (contact) => {
        try {
            const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
            await api.put(`/contacts/${contact.id}`, updatedContact);
            setContacts(prev => prev.map(c => c.id === contact.id ? updatedContact : c));
        } catch (error) {
            console.error("Error updating favorite status", error);
        }
    };
    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/contacts/${deleteId}`);
            fetchContacts();
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting contact", error);
        }
    };
    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              contact.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFavorite = showFavoritesOnly ? contact.isFavorite : true;
        return matchesSearch && matchesFavorite;
    });
    const displayedContacts = filteredContacts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredContacts.length;
    const handleLoadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 6);
            setLoading(false);
        }, 600);
    };
    return (
        <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="🔍 Search name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setVisibleCount(6);
                        }}
                        style={{ width: '250px' }}
                    />
                    <button 
                        className={`btn btn-sm ${showFavoritesOnly ? 'btn-danger' : 'btn-outline-danger'} fw-semibold`}
                        onClick={() => {
                            setShowFavoritesOnly(prev => !prev);
                            setVisibleCount(6);
                        }}
                    >
                        ❤️ Favorites
                    </button>
                    {showFavoritesOnly && (
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => { setShowFavoritesOnly(false); setSearchQuery(''); }}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
                <button
                    className="btn btn-primary btn-sm px-3 fw-semibold text-nowrap"
                    onClick={() => navigate('/dashboard/add')}
                >
                    + Add Contact
                </button>
            </div>
            {loading && contacts.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading contacts...</p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted fs-5">No contacts found.</p>
                </div>
            ) : (
                <>
                    <div className="row">
                        {displayedContacts.map(contact => (
                            <ContactCard
                                key={contact.id}
                                contact={contact}
                                onView={(c) => navigate(`/dashboard/view/${c.id}`)}
                                onEdit={(c) => navigate(`/dashboard/edit/${c.id}`)}
                                onDelete={(id) => { setDeleteId(id); setShowDeleteModal(true); }}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                    <ContactLoader 
                        loading={loading} 
                        hasMore={hasMore} 
                        onLoadMore={handleLoadMore} 
                    />
                </>
            )}
            <ContactDelete
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
function ContactFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        photo: '',
        isFavorite: false
    });
    useEffect(() => {
        if (id) {
            api.get(`/contacts/${id}`).then(res => setFormData(res.data)).catch(err => console.error(err));
        }
    }, [id]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/contacts/${id}`, formData);
            } else {
                await api.post('/contacts', formData);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving contact", error);
        }
    };
    return (
        <div className="card card-custom shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
            <h3 className="fw-bold mb-4">{id ? '✏️ Edit Contact' : '➕ Add New Contact'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold small">Full Name *</label>
                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small">Job Title</label>
                    <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Frontend Developer" />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small">Company Name</label>
                    <input type="text" className="form-control" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Google" />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small">Email Address *</label>
                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold small">Phone Number *</label>
                    <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="form-label fw-bold small">Profile Photo URL</label>
                    <input type="text" className="form-control" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} />
                </div>
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 fw-semibold">Save Contact</button>
                    <button type="button" className="btn btn-secondary px-4" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
function ContactViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);
    useEffect(() => {
        api.get(`/contacts/${id}`).then(res => setContact(res.data)).catch(err => console.error(err));
    }, [id]);

    if (!contact) return <div className="text-center py-5">Loading contact details...</div>;
    return (
        <div className="card card-custom shadow p-4 mx-auto text-center" style={{ maxWidth: '500px' }}>
            <img src={contact.photo} alt={contact.name} className="avatar-img mx-auto mb-3 shadow-sm" />
            <h3 className="fw-bold">{contact.name}</h3>
            <p className="text-muted mb-1">
                {contact.title && contact.company 
                    ? `${contact.title} at ${contact.company}` 
                    : contact.title || contact.company || "No Title / Company"}
            </p>
            <hr className="my-3" />
            <p className="mb-2"><strong>📧 Email:</strong> {contact.email}</p>
            <p className="mb-4"><strong>📞 Phone:</strong> {contact.phone}</p>
            <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-primary btn-sm px-4" onClick={() => navigate(`/dashboard/edit/${contact.id}`)}>Edit</button>
                <button className="btn btn-secondary btn-sm px-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>
        </div>
    );
}
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> 
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard/*" element={<Layout />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}