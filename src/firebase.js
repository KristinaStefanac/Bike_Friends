import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeGAdyHorqFqhK-NhgFPWps6OI2Ik4vrs",
    authDomain: "bike-friends-2e383.firebaseapp.com",
    projectId: "bike-friends-2e383",
    storageBucket: "bike-friends-2e383.firebasestorage.app",
    messagingSenderId: "60920697634",
    appId: "1:60920697634:web:de3ec40b36b1ece5908b7b",
    measurementId: "G-GTFMJGWH42"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);