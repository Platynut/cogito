import { auth, db, googleProvider } from "../firebase/firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function signUpWithEmail(email, password, pseudo) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("pseudo", "==", pseudo));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("Ce pseudo est déjà utilisé");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      email,
      pseudo,
      dayStreak: 0,
      maxDaystreak: 0,
      winStreak: 0,
      maxWinstreak: 0,
      endlessWinStreak: 0,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Cet email est déjà utilisé");
    } else {
      throw error;
    }
  }
}


export async function loginWithEmail(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

async function getGoogleUserInfo() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user; 
}

export async function registerWithGoogle() {
  const user = await getGoogleUserInfo();
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (userDoc.exists()) {
    throw new Error("Compte déjà existant, veuillez vous connecter");
  }

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    pseudo: user.displayName || "",
    dayStreak: 0,
    maxDaystreak: 0,
    winStreak: 0,
    maxWinstreak: 0,
    endlessWinStreak: 0,
  });
  return user;
}

export async function loginWithGoogle() {
  const user = await getGoogleUserInfo();
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("Compte non trouvé, veuillez créer un compte");
  }
  return user;
}


export async function loginAnonymously() {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    pseudo: "Invité",
    dayStreak: 0,
    maxDaystreak: 0,
    winStreak: 0,
    maxWinstreak: 0,
    endlessWinStreak: 0,
  });

  return user;
}

export async function loginWithPseudo(pseudo, password) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("pseudo", "==", pseudo));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Pseudo introuvable");
  }

  const email = snapshot.docs[0].data().email;
  return signInWithEmailAndPassword(auth, email, password);
}