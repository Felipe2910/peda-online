// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCM24GXcyXy0QSTfVFxkUhSGzVmR-Tcxbw",
	authDomain: "peda-online.firebaseapp.com",
	databaseURL: "https://peda-online-default-rtdb.firebaseio.com",
	projectId: "peda-online",
	storageBucket: "peda-online.firebasestorage.app",
	messagingSenderId: "753288495368",
	appId: "1:753288495368:web:3fefc0e2afbf01b0406cbd",
	measurementId: "G-E0Y0G57J51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Obtener referencia a la base de datos en tiempo real
const database = getDatabase(app);
export { database };
