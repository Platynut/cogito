import { useState } from "react";
import "../css/help.css";
import FeedbackModal from './modal/FeedbackModal'

export default function Help({ onClose }) {  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <div className="help-overlay" onClick={onClose} />
      <div className="help-modal">
        <button
          className="help-close"
          onClick={onClose}
          aria-label="Fermer l'aide"
        >
          ×
        </button>
        <div className="help-content">
          Bienvenue dans la bêta test de Cogito Quiz !<br />
          Ceci n'est que le début ! N'hésites pas à me faire part de tes retours !
        </div>
        <button className="help-feedback-btn" onClick={() => setShowFeedbackModal(true)}>
          Envoyer un feedback
        </button>
        {showFeedbackModal && (
          <FeedbackModal 
            onClose={() => setShowFeedbackModal(false)}
            onSubmit={() => setShowFeedbackModal(false)}
          />
        )}
      </div>
    </>
  );
}
