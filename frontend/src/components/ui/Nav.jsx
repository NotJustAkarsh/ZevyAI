import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
const Nav = () => {
  const { selectedConvversation } = useSelector((state) => state.coversation);
  return (
    <div className="h-14 flex items-center px-5 border-b border-white/6 bg-[#0d0f14]">
      <div>
        <MessageSquare />
      </div>
      <div>{selectedConvversation?.title || "New Chat"}</div>
      <div>
        
      </div>
    </div>
  );
};

export default Nav;
