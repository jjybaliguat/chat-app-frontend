import { apiSlice } from "@/lib/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getallchats: builder.mutation({
            query: () => ({
                url: '/chat',
                method: "GET",
            })
        }),
        getallmessages: builder.mutation({
            query: (id) => ({
                url: `/message/${id}`,
                method: "GET",
            })
        }),
        sendmessage: builder.mutation({
            query: credentials => ({
                url: `/message`,
                method: "POST",
                body: {...credentials}
            })
        }),
        searchuser: builder.mutation({
            query: (keyword) => ({
                url: `/user?search=${keyword}`,
                method: "GET",
            })
        }),
        fetchchat: builder.mutation({
            query: credentials => ({
                url: `/chat`,
                method: "POST",
                body: {...credentials}
            })
        }),
        crerategroupchat: builder.mutation({
            query: credentials => ({
                url: `/chat/group`,
                method: "POST",
                body: {...credentials}
            })
        }),
        deletegroup: builder.mutation({
            query: credentials => ({
                url: `/chat/remove-group`,
                method: "DELETE",
                body: {...credentials}
            })
        }),
        removechatmember: builder.mutation({
            query: credentials => ({
                url: `/chat/remove-from-group`,
                method: "PUT",
                body: {...credentials}
            })
        }),
        addchatmember: builder.mutation({
            query: credentials => ({
                url: `/chat/add-group`,
                method: "PUT",
                body: {...credentials}
            })
        }),
    })
})

export const {
    useGetallchatsMutation,
    useGetallmessagesMutation,
    useSendmessageMutation,
    useSearchuserMutation,
    useFetchchatMutation,
    useCrerategroupchatMutation,
    useDeletegroupMutation,
    useRemovechatmemberMutation,
    useAddchatmemberMutation
} = chatApiSlice