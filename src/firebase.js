import firebase from "firebase";
import "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "day-logger-001.firebaseapp.com",
  projectId: "day-logger-001",
  storageBucket: "day-logger-001.appspot.com",
  messagingSenderId: "1019513655122",
  appId: "1:1019513655122:web:06f33e6dd22c185014b48b",
  measurementId: "G-QH13JCG28K",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
