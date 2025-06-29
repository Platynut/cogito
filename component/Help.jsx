import React from "react";
import "../css/help.css";

export default function Help({ onClose }) {
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
      </div>
    </>
  );
}
