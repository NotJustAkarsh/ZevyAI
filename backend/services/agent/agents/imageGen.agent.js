import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";

export const imageGenAgent = async (state) => {
  await checkAgentLimit(state.userId,"image")
  try {
    const llm = await getModel("image");

    const res = await llm.invoke(`
        You are an elite AI image prompt engineer.
        
        COnvert the user request into a highly detailed image generation prompt.
        
        Requirements:
        
        - Cinematic Lightning
        - Professional Composition
        - Ultra realistic
        - High detail
        - Beautiful color palatte
        - Sharp focus
        - 8k quality
        - Photorealistic
        - Depth of Field
        - Professional photography
        - Stunning visuals
        
        Return only the image prompt.
        
        User Request:
        ${state.prompt}`);

    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

    await deductCredits(state.userId, "image");

    const buffer = Buffer.from(imageRes.data);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");

    const downloadUrl = await getFromS3(filename, 24 * 60);

    return {
      ...state,
      aiResponse: "✅ Image generated successfully.",
      images: [downloadUrl],
    };
  } catch (error) {
    return {
      ...state,
      images: [],
      aiResponse: error?.data?.message || "Failed to generate Image",
    };
  }
};
