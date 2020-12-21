import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyC9A-e3DbSStplkF02QW8wbFB0u8WXwdCM",
    authDomain: "instagrm-clone-5a607.firebaseapp.com",
    projectId: "instagrm-clone-5a607",
    storageBucket: "instagrm-clone-5a607.appspot.com",
    messagingSenderId: "395574473464",
    appId: "1:395574473464:web:8ae2d0fcc27c391fd0410d"
};

 firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};
