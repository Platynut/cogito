import React from "react";
import logo from "../icons/logo.png";
import "../css/acceuil.css";

export default function Acceuil({ onQuizDuJour, onSolo }) {
  return (
    <div className="acceuil">
      <img src={logo} alt="Logo Cogito" className="acceuil-logo" />
      <div className="acceuil-btns">
        <button className="acceuil-btn" onClick={onQuizDuJour}>Quiz du jour</button>
        <button className="acceuil-btn" onClick={onSolo}>Solo</button>
      </div>
    </div>
  );
}
