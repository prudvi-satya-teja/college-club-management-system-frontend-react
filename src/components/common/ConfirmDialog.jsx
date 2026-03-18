import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import './ConfirmDialog.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, message, title = 'Confirm Action' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-body">
        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn confirm-btn-danger"
            onClick={() => { onConfirm(); onClose(); }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}