// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");
const firebaseui = require("firebaseui");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyC1F00ZA2h1SFV8gpITnjcqj0yOC0KJRtc",
    authDomain: "tutors4zoomers.firebaseapp.com",
    databaseURL: "https://tutors4zoomers.firebaseio.com",
    projectId: "tutors4zoomers",
    storageBucket: "tutors4zoomers.appspot.com",
    messagingSenderId: "663406727983",
    appId: "1:663406727983:web:d5e12cd9e0b81ac118c7da",
    measurementId: "G-LK2XLSVTK6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize the FirebaseUI Widget using Firebase
let ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
})