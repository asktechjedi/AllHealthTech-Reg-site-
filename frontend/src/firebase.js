import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDAJ37YIpRwezRTC_j4bqDGhFxQGSV9nMI",
  authDomain: "allhealthtech-20385.firebaseapp.com",
  projectId: "allhealthtech-20385",
  storageBucket: "allhealthtech-20385.firebasestorage.app",
  messagingSenderId: "797772223728",
  appId: "1:797772223728:web:ade6717a3a1e1e08281e35",
  measurementId: "G-NBDHZ4Q6KV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
export { logEvent } from "firebase/analytics";