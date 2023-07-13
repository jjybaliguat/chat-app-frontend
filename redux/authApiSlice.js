"use client"
import { apiSlice } from "@/lib/apiSlice";
import { logOut } from './userAction'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/user/login',
                method: "POST",
                body: {...credentials}
            })
        }),
        register: builder.mutation({
            query: credentials => ({
                url: '/user/',
                method: "POST",
                body: {...credentials}
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'user/logout',
                method: 'GET'
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled
                    dispatch(logOut())
                    setTimeout(() =>  {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loginstatus: builder.mutation({
            query: () => ({
                url: '/user/loggedin',
                method: 'GET',
            })
        }),
        updateuser: builder.mutation({
            query: credentials => ({
                url: '/user/update-user',
                method: 'PATCH',
                body: {...credentials}
            })
        }),
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useLoginstatusMutation,
    useUpdateuserMutation,
    useRegisterMutation
} = authApiSlice