import {
  Coins,
  LogOut,
  MessageSquare,
  PanelLeft,
  PanelRightIcon,
  PenBoxIcon,
  Plus,
  PlusIcon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import logOut from "../features/logOut";
import { setUserData } from "../redux/userSlice";
import BillingDrawer from "./layout/BillingDrawer";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, [userData?._id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldCollapse = isMobile ? !mobileOpen : collapsed;

  if (shouldCollapse) {
    return (
      <div className="flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/6 py-4 gap-1 shrink-0">
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => {
            if (isMobile) {
              setMobileOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        >
          <PanelRightIcon />
        </button>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-green-500 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={() => dispatch(setSelectedConversation(null))}
        >
          <Plus />
        </button>
        <div className="flex-1 overflow-y-auto px-2.5 scrollbar-none [&::-webkit-scrollbar]:hidden p-10">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv._id;
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedConversation(conv));
                  setMobileOpen(false);
                }}
                className={`flex justify-center items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors w-10 h-10 duration-150 text-sm ${isActive ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
                key={i}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-lg transition-colors  duration-150${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/5 text-slate-500"}`}
                >
                  <MessageSquare size={16} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative shrink-0">
          {userData?.avatar && !imageError ? (
            <div>
              <img
                className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25"
                src={userData.avatar}
                alt="image"
                onError={() => {
                  setImageError(true);
                }}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      {isMobile && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}
    <div className={`${isMobile ? "fixed inset-y-0 left-0 z-40 w-67.5 shadow-2xl" : "relative w-67.5"} flex h-screen shrink-0 bg-[#0d0f14] border-r border-white/6`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}

        <div className="flex justify-between items-center px-4 py-4 border-b border-white/6">
          <div className="flex gap-4">
            <span
              className="flex items-center justify-center w-7 h-7 text-slate-500 hover:text-slate-200 transition-colors duration-150 bg-transparent cursor-pointer"
              onClick={() => {
                if (isMobile) {
                  setMobileOpen(false);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
            >
              <PanelLeft />
            </span>
            <span className="text-[16px] font-semibold tracking-tight text-slate-100">
              ZevyAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-blue-500 tracking-wide text-blue-50 py-1 px-2 text-xs rounded-full">
              {userData.plan || "Free"}
            </span>
            <span
              className="text-slate-500 hover:text-slate-200 transition-colors duration-150 bg-transparent cursor-pointer"
                onClick={() => {
                  dispatch(setSelectedConversation(null));
                  setMobileOpen(false);
                }}
            >
              <PenBoxIcon size={16} />
            </span>
          </div>
        </div>

        {/* Big New Chat Button */}

        <div className="px-4 pt-4 pb-1">
          <button
            className="font-semibold flex px-3 py-2 items-center justify-center w-full gap-2 rounded-xl text-black bg-slate-100 hover:opacity-90 active:scale-101 transition-all duration-150"
            onClick={() => {
              dispatch(setSelectedConversation(null));
              setMobileOpen(false);
            }}
          >
            <PlusIcon size={18} />
            New Chat
          </button>
        </div>

        {/* Chats Section */}

        {conversations.length == 0 ? (
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            NO RECENT CONVERSATIONS
          </div>
        ) : (
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            Recents
          </div>
        )}

        {/* Conversations */}

        <div className="flex-1 overflow-y-auto px-2.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {conversations.map((conv, i) => {
            const isActive = selectedConversation?._id == conv._id;
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedConversation(conv));
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 text-sm ${isActive ? "bg-indigo-500/10 border-indigo-500/18" : "bg-transparent border-transparent"}`}
                key={i}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-lg transition-colors  duration-150${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/5 text-slate-500"}`}
                >
                  <MessageSquare size={16} />
                </div>
                <span
                  className={`text-[13px] font-medium truncate${isActive ? "text-slate-100" : "text-slate-300"}`}
                >
                  {conv.title || "New Chat"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mx-2.5 h-px bg-white/6" />

        <div className="px-3.5 py-3.5">
          {userData ? (
            <div
              className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-150`}
            >
              <div className="relative shrink-0">
                {userData?.avatar && !imageError ? (
                  <div>
                    <img
                      className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25"
                      src={userData.avatar}
                      alt="image"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center">
                    <User size={15} className="text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                  {userData?.name || "user"}
                </p>
                <p className="text-[11px] text-slate-600 mt-px">{`${userData.plan} plan`|| "Free plan"}</p>
              </div>
              <div className="flex gap-1">
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  onClick={() => setShowBilling(true)}
                >
                  <Coins size={16} />
                </button>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/8 hover:text-red-500 transition-all duration-150"
                  onClick={() => {
                    logOut();
                    dispatch(setUserData(null));
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button>Login</button>
          )}
        </div>
      </div>
      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </div>
    </>
  );
};

export default Sidebar;
