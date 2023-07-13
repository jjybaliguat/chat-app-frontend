import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: [],
    notifications: []
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = [...action.payload]
        },
        addChat: (state, action) => {
            state.chats = [action.payload, ...state.chats]
        },
        removeChat: (state, action) => {
            const {chatId} = action.payload
            state.chats = state.chats.filter((chat)=>chat._id !== chatId)
        },
        updateChat: (state, action) => {
            state.chats = state.chats.map((chat)=> (chat._id === action.payload._id ? action.payload : chat))
        },
        setNotification: (state, action) => {
            const isEmpty = state.notifications
            let arr = []
            if(isEmpty){
                arr = [action.payload, ...state.notifications]
            }else{
                arr = [action.payload]
            }
            const newNotif = Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse)
            state.notifications = newNotif
        },
        removeNotif: (state, action) => {
            state.notifications = state.notifications?.filter((notif)=>notif.chat._id !== action.payload)
        }
    }
})

export const {
    setChats,
    addChat,
    removeChat,
    updateChat,
    setNotification,
    removeNotif
} = chatSlice.actions


export default chatSlice.reducer

export const getAllChats = (state) => state.chat.chats