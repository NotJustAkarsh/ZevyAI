import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.js";
import api from "../../utils/axios.js";
import { FcGoogle } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

import Chatarea from "../components/Chatarea.jsx";
import Artifacts from "../components/Artifacts.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      <Sidebar/>
      <Chatarea/>
      <Artifacts/>
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-2xl bg-[#13151c] border border-white/8 rounded-2xl p-7 m-4 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl tracking-tight font-semibold">
                Welcome to ZevyAI
              </h2>
              <p className="text-xl text-slate-500">
                Please login to continue using the app.
              </p>
            </div>
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.75 rounded-xl bg-stone-100 text-slate-900 fonte font-semibold active:opacity-80 active:scale-99 hover:bg-gray-300 cursor-pointer transition-all duration-150"
            >
              <FcGoogle size={15} />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
