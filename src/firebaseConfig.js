// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database"; // Nur die benötigten Funktionen importieren
import { getAnalytics } from "firebase/analytics";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBnp2TZP8MH0D4RMDXEjyw6oJFQUCOFi5E",
  authDomain: "kirmesbingo.firebaseapp.com",
  databaseURL: "https://kirmesbingo-default-rtdb.firebaseio.com",
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

// Exportiere nur die relevanten Methoden für die Datenbank
export { database, ref, set, onValue };
