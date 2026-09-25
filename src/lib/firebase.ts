import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(config).every((v) => typeof v === "string" && v.trim().length > 0);
export const firebaseApp: FirebaseApp | null = firebaseConfigured
  ? getApps()[0] || initializeApp(config)
  : null;
export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;

const localEmulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL;
if (firebaseAuth && localEmulatorUrl && typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
  connectAuthEmulator(firebaseAuth, localEmulatorUrl, { disableWarnings: true });
}
