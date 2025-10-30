import { initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuFXMXxkV-FjrrRkUI0hSAkZuZk6udUqE",
  authDomain: "vku-student-manager.firebaseapp.com",
  projectId: "vku-student-manager",
  storageBucket: "vku-student-manager.firebasestorage.app",
  messagingSenderId: "716010271655",
  appId: "1:716010271655:web:2120d998a36db314df3c82"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
