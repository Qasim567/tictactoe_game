import { FirebaseApp, initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCSh6qL7oHdX4zf-GTAWOsmv5GgeghVid4",
  authDomain: "tic-tac-toe-bf52a.firebaseapp.com",
  projectId: "tic-tac-toe-bf52a",
  storageBucket: "tic-tac-toe-bf52a.firebasestorage.app",
  messagingSenderId: "630045914062",
  appId: "1:630045914062:android:65a3118ec1bf50f15cb19f",
};

if (!FirebaseApp.apps.length) {
  initializeApp(firebaseConfig);
}
