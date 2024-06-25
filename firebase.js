// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,initializeAuth, getReactNativePersistence} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase/app';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth();
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export {app, auth, db}




