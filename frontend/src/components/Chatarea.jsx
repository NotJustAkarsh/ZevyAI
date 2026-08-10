import { useEffect } from "react";
import ChatInput from "./layout/ChatInput";
import MessageList from "./layout/MessageList";
import Nav from "./layout/Nav";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";

const Chatarea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        if(selectedConversation.title=="New Chat")return;
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMesg();
  }, [selectedConversation?._id]);

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default Chatarea;
