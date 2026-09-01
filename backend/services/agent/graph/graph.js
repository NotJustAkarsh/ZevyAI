import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";
import { pdfRagAgent } from "../agents/pdfRag.agent.js";
import { imageRagAgent } from "../agents/imageRag.agent.js";

const workflow = new StateGraph(agentState);
workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("image", imageGenAgent);
workflow.addNode("pdfRag", pdfRagAgent);
workflow.addNode("imageRag", imageRagAgent);

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "image":
        return "image";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "pdfRag":
        return "pdfRag";
      case "imageRag":
        return "imageRag";

      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    image: "image",
    pdf: "pdf",
    ppt: "ppt",
    pdfRag: "pdfRag",
    imageRag: "imageRag",
  },
);

workflow.addEdge("search", "chat");
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("image", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("pdfRag", "__end__");
workflow.addEdge("imageRag", "__end__");

export const graph = workflow.compile();
