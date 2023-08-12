import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyAhceeq1FT57kb8n32XqBt8A-S3pXRYt5M",
    authDomain: "spa-blog-c38e8.firebaseapp.com",
    projectId: "spa-blog-c38e8",
    storageBucket: "spa-blog-c38e8.appspot.com",
    messagingSenderId: "816528132564",
    appId: "1:816528132564:web:d0e568d58352c8f3b52e41"
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);