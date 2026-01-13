const firebaseConfig = {
  apiKey: "AIzaSyDwwb-n482o25WigYqk43U42gFvhXou9ws",
  authDomain: "uknown-projekt.firebaseapp.com",
  projectId: "uknown-projekt",
  storageBucket: "uknown-projekt.firebasestorage.app",
  messagingSenderId: "979467839250",
  appId: "1:979467839250:web:ea4cba13d6cc39aa9335cb",
  measurementId: "G-SCEB6LR1M4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();