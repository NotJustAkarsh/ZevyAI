import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  X,
  Send,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import sendMessage from "../../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, updateMessage } from "../../redux/messageSlice";
import { createConversation } from "../../features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../../redux/conversationSlice";
import { updateConversation } from "../../features/updateConversation";
import { useRef } from "react";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const previewUrl = useMemo(() => {
    if (!selectedFile?.type.startsWith("image/")) {
      return "";
    }
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleSendMessage = async () => {
    let conversation = selectedConversation;

    if (!conversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }

    if (conversation.title == "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() });
      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: value.slice(0, 40),
        }),
      );
    }

    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    dispatch(addMessage({ role: "user", content: value.trim() }));
    const loadingMessageIndex = messages.length + 1;
    const loadingMessage = { role: "assistant", content: "", loading: true };
    dispatch(addMessage(loadingMessage));
    setValue("");
    setSelectedFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    const data = await sendMessage(formData);

    dispatch(
      updateMessage({
        index: loadingMessageIndex,
        message: {
          role: "assistant",
          content: data?.answer || "Failed to generate a response.",
          images: data?.images,
        },
      }),
    );

    dispatch(setArtifacts(data?.artifacts || []));

    console.log(data);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
  ];
  return (
    <div className="w-full overflow-hidden px-3 pr-16 lg:px-5 lg:pr-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent, i) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                key={i}
                onClick={() => setSelectedAgent(agent.label)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${isActive ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,182,241,.35)]" : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/7 "}`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>
        <textarea
          onChange={(e) => setValue(e.target.value)}
          value={value}
          name=""
          id=""
          rows={3}
          placeholder="What's on your mind today ???"
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />
        {selectedFile && (
          <div className="flex items-center gap-2 self-start max-w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt={selectedFile.name}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <FileText size={18} className="text-slate-400" />
            )}
            <span className="max-w-40 truncate text-xs text-slate-300">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={removeSelectedFile}
              aria-label={`Remove ${selectedFile.name}`}
              title="Remove file"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/10 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex">
            <input type="file" accept=".pdf,image/*" hidden ref={fileRef} onChange={(e) => {
              const file = e.target.files?.[0]
              if(file){
                setSelectedFile(file)
              }
            }} />
            <button type="button" aria-label="Attach a file" title="Attach a file" className="flex items-center justify-center w-8 h-8 rounded-full text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer" onClick={() => fileRef.current?.click()} >
              <Paperclip size={16} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-full text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={18} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!value.trim() && !selectedFile}
            className={`flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer transition-all duration-150 hover:opacity-80 text-white ${value.trim() || selectedFile ? "bg-linear-to-br from-indigo-500 to-violet-700" : "bg-white/5 text-slate-600 cursor-not-allowed"} `}
          >
            <Send size={16} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
