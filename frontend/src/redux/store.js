import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import conversationsReducer from "./conversationSlice"
import messageReducer from "./messageSlice"

export const store = configureStore({
    reducer:{
        user:userReducer,
        conversation:conversationsReducer,
        message:messageReducer
    }
})