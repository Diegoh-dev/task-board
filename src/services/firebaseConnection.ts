import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';//conectar o banco de dados

const firebaseConfig = {
  apiKey: "AIzaSyD-o3H3OqAzNjAFAHRl_vzTDoe7jkQm8U8",
  authDomain: "tarefasplus-e7500.firebaseapp.com",
  projectId: "tarefasplus-e7500",
  storageBucket: "tarefasplus-e7500.appspot.com",
  messagingSenderId: "810361294217",
  appId: "1:810361294217:web:2da8e84a17d8b250b92558"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const db = getFirestore(fireBaseApp);
export {db};