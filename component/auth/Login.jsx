import { useState } from "react";
import "../../css/login.css";
import {
    loginWithEmail,
    loginWithGoogle,
    loginAnonymously,
    loginWithPseudo
} from "../../scripts/firebase/auth.js"

export default function Login({ onForgotPassword, onRegister }) {
  const [mode, setMode] = useState("email"); 
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "email") {
        await loginWithEmail(identifier, password);
      } else if (mode === "pseudo") {
        await loginWithPseudo(identifier, password);
      }
      alert("Connexion réussie !");
    } catch (err) {
      console.error(err);
      setError("Identifiants incorrects ou utilisateur non trouvé.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError("Erreur avec Google.");
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await loginAnonymously();
    } catch (err) {
      console.error(err);
      setError("Erreur en mode invité.");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>

      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="email">Connexion avec email</option>
        <option value="pseudo">Connexion avec pseudo</option>
      </select>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder={mode === "email" ? "Email" : "Pseudo"}
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="link-btn"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </button>
        <button type="submit">Se connecter</button>
      </form>

      <button onClick={handleGoogleLogin}>Se connecter avec Google</button>
      <button onClick={handleAnonymousLogin}>Se connecter en tant qu'invité</button>

      <div className="login-links">
          <button
            type="button"
            className="link-btn"
            onClick={onRegister}
          >
            Pas de compte ? Créer un compte
          </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
