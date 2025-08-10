import logo from "../icons/logo.png";
import userIcon from "../icons/user.png";
import "../css/acceuil.css";

export default function Acceuil({ onQuizDuJour, onSolo, onProfile }) {
  return (
    <div className="acceuil">
      <button className="profile-btn" onClick={onProfile} aria-label="Profil">
        <img src={userIcon} alt="Profile" className="profile-icon" />
      </button>
      <img src={logo} alt="Logo Cogito" className="acceuil-logo" />
      <div className="acceuil-btns">
        <button className="acceuil-btn" onClick={onQuizDuJour}>Quiz du jour</button>
        <button className="acceuil-btn" onClick={onSolo}>Solo</button>
      </div>
    </div>
  );
}
