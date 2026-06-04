import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI83o1BbfFw4Uo9rwVf17tdHjO-IZUrok",
  authDomain: "foodchainai-c2e4a.firebaseapp.com",
  projectId: "foodchainai-c2e4a",
  storageBucket: "foodchainai-c2e4a.firebasestorage.app",
  messagingSenderId: "911322377948",
  appId: "1:911322377948:web:873773745a19c2acc70e19"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);