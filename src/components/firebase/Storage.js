import React from 'react'
import firebase from "firebase/compat/app"
import "firebase/compat/storage"


const firebaseConfig = {
  apiKey: "AIzaSyAjQZQjRNBoKmW6zaVyzfuiIFVBjX3DtOA",
  authDomain: "faceclone-ef407.firebaseapp.com",
  projectId: "faceclone-ef407",
  storageBucket: "faceclone-ef407.appspot.com",
  messagingSenderId: "886992048182",
  appId: "1:886992048182:web:8351d43d60aeedfb75c897"
};


firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

export {
  storage,
  firebase as
  default
};