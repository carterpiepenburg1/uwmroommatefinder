import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Values come from frontend/.env  (VITE_ prefix exposes them to the browser)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let db = null;
let auth = null;

try {
    if (!firebaseConfig.apiKey) {
        console.warn(
            "[Firebase] VITE_FIREBASE_API_KEY is missing from frontend/.env — chat will be disabled."
        );
    } else {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (err) {
    console.error("[Firebase] Initialization failed:", err.message);
}

export { db, auth };
