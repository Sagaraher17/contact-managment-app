import React from 'react';

export default function ContactLoader({ loading, hasMore, onLoadMore }) {
    if (!loading && !hasMore) return null;

    return (
        <div className="text-center my-5 py-3">
            {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted small fw-semibold m-0">Loading more contacts...</p>
                </div>
            ) : (
                hasMore && (
                    <button 
                        className="btn btn-outline-primary px-4 py-2 fw-semibold rounded-pill shadow-sm"
                        onClick={onLoadMore}
                    >
                        Load More Contacts🔽
                    </button>
                )
            )}
        </div>
    );
}