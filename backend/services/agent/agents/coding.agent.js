import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");
  const intentRes = await intentLlm.invoke(`
        You are an intent classifier.
        
        Return ONLY one of these values.
        
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLANATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION
        
        User Request:
        ${state.prompt}
        `);
  const intent = intentRes.content;
  if (intent == "CODE_GENERATION") {
    const prompt = `
        You are ZevyAI Coding Agent.
        
        Generate the requested project.
        
        Default stack:
        - HTML
        - CSS
        - JavaScript
        
        Use React / Next.js / Vue only if explicitly requested.
        
        Rules:
        
        - Responsive
        - Modern UI
        - CSS Variables
        - Flexbox/Grid
        - Smooth Scroll
        - Hover Effects
        - Beautiful Spacing
        - Single page unless user asks otherwise.
        
        Return ONLY valid JSON.
        
        Schema:
        
        {
            "files":[
                {
                    "name":"index.html",
                    "content":"..."
                },
                {
                    "name":"style.css",
                    "content":"..."
                },
                {
                    "name":"script.js",
                    "content":"..."
                }
            ]
        }
            
        
        Rules: 
        
        - Output must start with {
        - Output must end with }
        - No markdown
        - No Explanation
        - No Extra text
        - No \`\`\`
        - Never mention intent
        
        
        User Request:
        ${state.prompt}`;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    await deductCredits(state.userId,"coding")
    return {
      ...state,
      aiResponse: "Code Generated Successfully.",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: data.files || [],
          title:state.prompt
        },
      ],
    };
  }

  const res = await llm.invoke(`
    The user's request is:
    
    ${intent}
    
    Return Markdown only
    
    Nver generate project files.
    
    Use headings like:
    
    # Overview
    
    ## Explanation

    ## Problems
    
    ## Improvements
    
    ## Best Practices
    
    ## Optimized Code (if needed)
    
    User Request:
    
    ${state.prompt}
    `);

    const data = res.content
    await deductCredits(state.userId,"coding")
    return {
        ...state,
        aiResponse:data,
        artifacts:[]
    }
};
