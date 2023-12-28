// firebase.js

import { initializeApp, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

let app;

try {
  // 既に存在する場合は初期化しないようにする
  app = getApp();
} catch (e) {
  // アプリが存在しない場合は初期化
  app = initializeApp({ ...firebaseConfig, projectId: process.env.NEXT_PUBLIC_PROJECT_ID });
}

const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  return auth;
}

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // アンマウントされる前にマウントされているかどうかを示すフラグ
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      if (isMounted) {
        setUser(userData || null);
      }
    });

    return () => {
      // Clean up the subscription when the component unmounts
      isMounted = false;
      unsubscribe();
    };
  }, [auth]);

  return user;
}

export { auth, firestore, googleProvider };