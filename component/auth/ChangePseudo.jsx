import { useState, useEffect } from "react";
import { auth, db } from "../../scripts/firebase/firebase.js";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export default function ChangePseudo({ onPseudoChange }) {
  const [newPseudo, setNewPseudo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChangePseudo = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPseudo.trim()) {
      setError("Le pseudo ne peut pas être vide.");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("pseudo", "==", newPseudo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Ce pseudo est déjà utilisé.");
        return;
      }

      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { pseudo: newPseudo });

      setSuccess("Pseudo mis à jour avec succès !");
      setNewPseudo("");
      if (onPseudoChange) onPseudoChange(newPseudo);

    } catch (err) {
      setError("Erreur lors de la mise à jour : " + err.message);
    }
  };

  return (
    <form onSubmit={handleChangePseudo}>
    <input
        type="text"
        value={newPseudo}
        onChange={(e) => setNewPseudo(e.target.value)}
        placeholder={"Entrez un nouveau pseudo"}
    />
    <button className="change-pseudo-btn" type="submit">Changer de pseudo</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
