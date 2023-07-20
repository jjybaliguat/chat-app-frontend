import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    logged_in: false,
    onlineUsers: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const {token, user} = action.payload
            state.user = user
            state.token = token
        },
        updateUser: (state, action) => {
            const {user} = action.payload
            state.user = user
        },
        logOut: (state, action) => {
            state.user = null,
            state.token = null,
            state.logged_in = false
        },
        setLoggedIn: (state, action) => {
            const {logged_in} = action.payload
            state.logged_in = logged_in
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = [...action.payload]
        }
    }
})

export const {
    setUser,
    logOut,
    setLoggedIn,
    updateUser,
    setOnlineUsers
} = authSlice.actions


export default authSlice.reducer

export const selectCurrentUser = (state) => state?.auth.user
export const getLoginStatus = (state) => state?.auth.logged_in