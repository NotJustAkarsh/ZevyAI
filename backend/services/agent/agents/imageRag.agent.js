import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import fs from "fs/promises";
import { checkAgentLimit } from "../config/agentlimit.js";

export const imageRagAgent = async (state) => {
  await checkAgentLimit(state.userId,"image")
  try {
    const llm = await getModel("imageRag");
    const imageBuffer = await fs.readFile(state.file.path);

    const base64Image = imageBuffer.toString("base64");

    const messages = [
      new SystemMessage(`You are ZevyAi image analyser agent.
            
            Rules:
            - Analyze only the uploaded image.
            - Answer the user's question accurately.
            - If text existes in the image, extract it.
            - If charts or tables exist , explain them.
            - If something is unclear , say so.
            - Use Markdown when helpful.
            - Do not hallucinate.`),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze the image",
          },
          {
            type:"image_url",
            "image_url":{
                url:`data:${state.file.mimetype};base64,${base64Image}`
            }
          }
        ],
      }),
    ];

    const response = await llm.invoke(messages)

    await deductCredits(state.userId,"image")
    return{
      ...state,
      aiResponse: response.content
    }
  } catch (error) {
    console.log(error)
    return{
      ...state,
      aiResponse: error?.data?.message || "Failed to generate Image",
    }
  }finally{
    if (state.file?.path) {
      await fs.unlink(state.file.path).catch(() => {})
    }
  }
};
