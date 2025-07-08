import React, { useState } from "react";
import "../css/problemModal.css";
import emailjs from "emailjs-com";

export default function ProblemModal({ onClose, onSubmit, question, id}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
        'service_e1dil3f', 
        'template_cw0rjmi', 
        {
            question: question || '',
            id: id || '',
            description: message,
        },
        'KPvzKTVNsZui5V-wt'
    ).then(() => {
        if (onSubmit) onSubmit({ message });
        setSent(true);
    });
  };

  return (
    <>
      <div className="help-overlay" onClick={onClose} />
      <div className="help-modal problem-modal">
        <button className="help-close" onClick={onClose} aria-label="Fermer">×</button>
        <div className="help-content">
          <h3>Signaler un problème</h3>
          {sent ? (
            <div className="success-message">Merci pour votre retour !</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                required
                placeholder="Décrivez le problème..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button type="submit" className="more-info">
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
