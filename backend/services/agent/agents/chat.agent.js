import { getModel } from "../config/llmModels.js";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const systemPrompt = `You are ZevyAI, an intelligent AI Assistant.

  Rules:

  - For simple questions , greetings, and short queries, respond naturally in plain text.
  - For technical, educational, coding, or detailed , use clean Markdown.
  
  Formatting:

  - Use # for titles and ## for sections.
  - Leave a blank line after heading.
  - Use bullet points for lists.
  - Use fenced code blocks with language tags for the code.
  - Keep paragraphs short and readable.
  - Never write heading and content on the same line.
  - Never generate large walls of text.
  `;
  const response = await llm.invoke([
    {
      "role": "system",
      "content": systemPrompt,
    },
    {
      "role": "human",
      "content": state.prompt,
    },
  ]);

  return {
    ...state,
    aiResponse: response.content,
  };
};
