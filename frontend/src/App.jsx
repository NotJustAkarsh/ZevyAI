import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, googleProvider } from "../utils/firebase";

const App = () => {

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data)
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button onClick={googleLogin} className="w-50 h-24 bg-white">Continue with google</button>
    </div>
  );
};

export default App;
