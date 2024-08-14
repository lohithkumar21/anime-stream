npm install in backend, frontend, root directory

in frontend/src/utils

1.create file constants.js, assign values of TMDB api_key, url 
export const API_KEY = ""; 
export const TMDB_BASE_URL = "";

2.create file firebase-constants, assign firebase configuration 

import { getAuth } from "firebase/auth"; 
import { initializeApp } from "firebase/app";


const firebaseConfig = { };

const app = initializeApp(firebaseConfig); 
export const firebaseAuth = getAuth(app);