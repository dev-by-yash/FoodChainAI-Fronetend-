import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // 🔹 Send Email OTP (Li  nk)
  const sendOtp = async () => {
    try {
      const actionCodeSettings = {
        url: "http://localhost:5173/",
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      localStorage.setItem("emailForSignIn", email);
      alert("OTP sent to email 📩");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // 🔹 Auto login when link clicked
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("emailForSignIn");

      if (!storedEmail) {
        storedEmail = window.prompt("Enter your email again:");
      }

      signInWithEmailLink(auth, storedEmail, window.location.href)
        .then(() => {
          localStorage.removeItem("emailForSignIn");
          alert("Login Success 🎉");
          window.location.href = "/dashboard";
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Email OTP Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="border p-3 w-full mb-4 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="bg-indigo-600 text-white w-full p-3 rounded-lg"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
