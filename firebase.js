// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADlt9tV1Q55o0gkFWniXtbbhElM5cLmmY",
  authDomain: "tracker-inventory-app.firebaseapp.com",
  projectId: "tracker-inventory-app",
  storageBucket: "tracker-inventory-app.appspot.com",
  messagingSenderId: "575130300754",
  appId: "1:575130300754:web:98c8fb96ec9a69a5564a8b",
  measurementId: "G-00QXJF29KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};