// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnp2TZP8MH0D4RMDXEjyw6oJFQUCOFi5E",
  authDomain: "kirmesbingo.firebaseapp.com",
  databaseURL: "https://kirmesbingo-default-rtdb.firebaseio.com", // Stelle sicher, dass die Database-URL korrekt ist
  projectId: "kirmesbingo",
  storageBucket: "kirmesbingo.appspot.com",
  messagingSenderId: "898528761801",
  appId: "1:898528761801:web:e136fda71b1e67a3ce3a18",
  measurementId: "G-GVKLQ048TC"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Die Realtime Database initialisieren

// Die relevanten Datenbank-Methoden exportieren
export { database, ref, set, onValue };
