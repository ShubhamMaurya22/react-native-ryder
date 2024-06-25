
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,initializeAuth, getReactNativePersistence} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase/app';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBQD6iAK51PywoAGQPVI8xJf3Tuj394psw",
  authDomain: "ryder-401215.firebaseapp.com",
  projectId: "ryder-401215",
  storageBucket: "ryder-401215.appspot.com",
  messagingSenderId: "716770071320",
  appId: "1:716770071320:web:992416139f6e1d4341c46d",
  measurementId: "G-7SVQLLNN05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth();
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export {app, auth, db}



// export const API_KEY = '0b3a6a5d-c3a0-4f21-9e53-6693ce03a1e9';


// export const client_id = 'free_tier_maurya.shubham_485200217e'
// export const client_secret = 'fb4e849e933e4153859a9ae18b4d238b'