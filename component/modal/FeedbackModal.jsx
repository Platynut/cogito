import { useState } from "react";
import "../../css/problemModal.css";
import emailjs from "emailjs-com";

export default function FeedbackModal({ onClose, onSubmit}) {
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
        'service_c0ps1zn', 
        'template_vgdj8e8', 
        {
            reason: reason,
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
          <h3>Envoyer votre feedback</h3>
          {sent ? (
            <div className="success-message">Merci pour votre retour !</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                required
                placeholder="Résumé du problème ou suggestion"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <textarea
                required
                placeholder="Décrivez votre problème ou votre suggestion ici"
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
