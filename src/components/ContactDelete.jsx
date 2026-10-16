
export default function ContactDelete({ show, onConfirm, onClose }) {
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content card-custom p-3 text-center">
                    <div className="modal-body">
                        <h5 className="fw-bold mb-3">⚠️ Delete Contact</h5>
                        <p className="small text-muted mb-4">Are you sure you want to remove this contact? This action cannot be undone.</p>
                        <div className="d-flex justify-content-center gap-2">
                            <button type="button" className="btn btn-secondary btn-sm px-3" onClick={onClose}>Cancel</button>
                            <button type="button" className="btn btn-danger btn-sm px-3" onClick={onConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}