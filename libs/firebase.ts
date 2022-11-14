import admin, { ServiceAccount } from "firebase-admin";
import { getApps, initializeApp } from "firebase/app";
import serviceKey from "./firebase.json";

const firebaseConfig = {
  apiKey: "AIzaSyCaHR2sTyIP2mNqU-IZhUEPHBobQaQN0VI",
  authDomain: "why-earth.firebaseapp.com",
  databaseURL: "https://why-earth-default-rtdb.firebaseio.com",
  projectId: "why-earth",
  storageBucket: "why-earth.appspot.com",
  messagingSenderId: "465479038616",
  appId: "1:465479038616:web:a793251be1faaff15f02ed",
  measurementId: "G-V58271NZJC",
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
    credential: admin.credential.cert(serviceKey as ServiceAccount),
    databaseURL: "https://why-earth-default-rtdb.firebaseio.com",
  });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { auth, db, storage, initializeFirebase };
