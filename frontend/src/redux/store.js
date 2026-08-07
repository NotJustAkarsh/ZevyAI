import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import conversationsReducer from "./conversationSlice"

export const store = configureStore({
    reducer:{
        user:userReducer,
        conversation:conversationsReducer
    }
})