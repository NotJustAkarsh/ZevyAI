import ChatInput from "./ui/ChatInput";
import MessageList from "./ui/MessageList";
import Nav from "./ui/Nav";

const Chatarea = () => {
  return <div className="flex-1 flex flex-col">
    <Nav/>
    <MessageList/>
    <ChatInput/>
  </div>;
};

export default Chatarea;
