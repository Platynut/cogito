import "../../css/infoModal.css";

export default function InfoModal({ onClose, description }) {
  return (
    <>
      <div className="info-overlay" onClick={onClose} />
      <div className="info-modal">
        <button
          className="info-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="info-content">
          {description}
        </div>
      </div>
    </>
  );
}