import { useState, useEffect } from "react";
import { auth, db } from "../scripts/firebase/firebase.js"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../css/profile.css";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import ChangePseudo from "./auth/ChangePseudo.jsx";

export default function Profile() {
    const [user, setUser] = useState(null); 
    const [profile, setProfile] = useState(null); 
    const [page, setPage] = useState("login");

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setProfile(docSnap.data());
        } else {
            setProfile(null);
        }
        } else {
        setProfile(null);
        }
    });

    return () => unsubscribe();
    }, []);

    if (user) {
    return (
        <div className="profile-connected">
        <h2>Bienvenue {profile?.pseudo} !</h2>

        <div className="profile-stats">
            <h3>Statistiques</h3>
            <ul>
            <li>Série quotidienne : {profile?.dayStreak ?? 0}</li>
            <li>Série max quotidienne : {profile?.maxDaystreak ?? 0}</li>
            <li>Série de victoires : {profile?.winStreak ?? 0}</li>
            <li>Série max de victoires : {profile?.maxWinstreak ?? 0}</li>
            <li>Série sans fin : {profile?.endlessWinStreak ?? 0}</li>
            </ul>
        </div>

        <ChangePseudo
            onPseudoChange={(newPseudo) => setProfile({ pseudo: newPseudo })}
        />
        <button onClick={() => auth.signOut()}>Se déconnecter</button>
        </div>
    );
    }

    return (
    <div className="profile-page">
        {page === "login" && (
        <Login
            onRegister={() => setPage("register")}
            onForgotPassword={() => {/* plus tard */}}
        />
        )}
        {page === "register" && (
        <Register onLogin={() => setPage("login")} />
        )}
    </div>
    );
}
