import { useState } from "react";
import "../../css/register.css";
import { signUpWithEmail, registerWithGoogle } from "../../scripts/firebase/auth";

export default function Register({ onLogin }) {
    const [pseudo, setPseudo] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await signUpWithEmail(email, password, pseudo)
            alert("Compte créé !")
        } catch (err) {
            alert("Erreur d'inscription :\n" + err.message)
        }
    }

    const handleGoogleSignup = async () => {
        try {
            await registerWithGoogle();
            alert("Connecté avec Google !")
        } catch (err) {
            alert("Erreur lors de la connexion avec Google :\n" + err.message)
        }
    }

    return (
        <div className="register-container">
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
                <input
                type="text"
                placeholder="Pseudo"
                required
                onChange={(e) => setPseudo(e.target.value)}
                />
                <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Mot de passe"
                required
                onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Créer un compte</button>
            </form>

            <hr />

            <button onClick={handleGoogleSignup}>
                S’inscrire avec Google
            </button>
            <button
                type="button"
                className="link-btn"
                onClick={onLogin}
            >
                Déjà un compte ?
                Se connecter
            </button>
        </div>
    )
}