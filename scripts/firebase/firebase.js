import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAT3gCdTKxadjihkV287KuJsilmzZrcO8k",
  authDomain: "cogito-6861f.firebaseapp.com",
  projectId: "cogito-6861f",
  storageBucket: "cogito-6861f.firebasestorage.app",
  messagingSenderId: "167074601222",
  appId: "1:167074601222:web:c45bbf89cce2598e84e687"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

//id board user : Mb5Bcb5lc1Cy51xWh2xU