import React from 'react';

export default function ContactCard({ contact, onView, onEdit, onDelete, onToggleFavorite }) {
  const isFavorite = contact.isFavorite;

  return (
    <div className="col-md-4 mb-4">
      <div className="card card-custom h-100 shadow-sm p-3 position-relative">
        <button 
          className="btn btn-sm position-absolute top-0 end-0 m-3 p-1 border-0 bg-transparent fs-5"
          onClick={() => onToggleFavorite(contact)}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          style={{ transition: 'transform 0.2s' }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        <div className="text-center mt-3">
          <img 
            src={contact.photo || "https://via.placeholder.com/150"} 
            alt={contact.name} 
            className="avatar-img shadow-sm"
          />
        </div>
        <div className="card-body text-center">
          <h5 className="card-title fw-bold mb-1">{contact.name}</h5>
          
          <p className="text-muted small mb-2">
            {contact.title && contact.company 
              ? `${contact.title} at ${contact.company}` 
              : contact.title || contact.company || "No Title / Company"}
          </p>

          <hr className="my-2 opacity-25" />
          <p className="card-text mb-1 small text-truncate">
            <strong>📧 Email:</strong> {contact.email}
          </p>
          <p className="card-text mb-3 small">
            <strong>📞 Phone:</strong> {contact.phone}
          </p>
          
          <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-outline-primary btn-sm px-3" onClick={() => onView(contact)}>
              View
            </button>
            <button className="btn btn-outline-warning btn-sm px-3" onClick={() => onEdit(contact)}>
             Edit
            </button>
            <button className="btn btn-outline-danger btn-sm px-3" onClick={() => onDelete(contact.id)}>
             Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}