import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts:[]
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage:(state,action)=>{
      state.messages.push(action.payload)
    },
    updateMessage: (state, action) => {
      const { index, message } = action.payload;
      if (state.messages[index]) {
        state.messages[index] = message;
      }
    },
    setArtifacts:(state,action)=>{
      state.artifacts = action.payload;
    }
  },
});

export const { setMessages, addMessage, updateMessage, setArtifacts } = messageSlice.actions;
export default messageSlice.reducer;
