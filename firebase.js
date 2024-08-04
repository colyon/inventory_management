// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBnqD0h6Uvtc2ZflR0Jt0-wvnLG91-1FUc",
    authDomain: "inventory-management-7449e.firebaseapp.com",
    projectId: "inventory-management-7449e",
    storageBucket: "inventory-management-7449e.appspot.com",
    messagingSenderId: "129122470773",
    appId: "1:129122470773:web:24121cecd7bbee67bb613c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }