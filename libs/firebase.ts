import admin, { ServiceAccount } from "firebase-admin";
import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const initializeFirebase = () => {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  } else {
    return initializeApp(firebaseConfig);
  }
};

if (!admin.apps.length) {
  initializeFirebase();

  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.NEXT_PUBLIC_FIREBASE_TYPE,
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
      client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
      auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
      token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CERT_URL,
    } as ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { auth, db, storage, initializeFirebase };
