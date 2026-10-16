
export default function ContactView({ show, contact, onClose }) {
    if (!show || !contact) return null;
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content card-custom p-3 text-center">
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold">Contact Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <img
                            src={contact.photo || "https://via.placeholder.com/150"}
                            alt={contact.name}
                            className="avatar-img shadow mb-3"
                        />
                        <h4 className="fw-bold">{contact.name}</h4>
                        <p className="text-muted mb-3">{contact.company || "Independent / No Company"}</p>
                        <hr className="opacity-25" />
                        <div className="text-start px-4">
                            <p className="mb-2"><strong>📧 Email:</strong> {contact.email}</p>
                            <p className="mb-2"><strong>📞 Phone:</strong> {contact.phone}</p>
                        </div>
                    </div>
                    <div className="modal-footer border-top-0 justify-content-center">
                        <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}