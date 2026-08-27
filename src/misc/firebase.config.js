import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const config = {
  apiKey: "AIzaSyCzrBHqTAohXGRA4BfIruDeBvzlHXbn1XM",
  authDomain: "college-chatapp.firebaseapp.com",
  projectId: "college-chatapp",
  storageBucket: "college-chatapp.firebasestorage.app",
  messagingSenderId: "1001106983429",
  appId: "1:1001106983429:web:04a6b5f46733375a206a6c",
  measurementId: "G-TB7RLNMMFL",
  databaseURL: "https://college-chatapp-default-rtdb.firebaseio.com",
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
