'use client'
 
import React, { useEffect, useState } from 'react'
import { PhoneIcon } from "@heroicons/react/24/solid";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { CameraIcon  } from "@heroicons/react/24/solid";
import { PaperAirplaneIcon   } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useFetchchatMutation, useGetallchatsMutation, useGetallmessagesMutation, useSendmessageMutation } from '@/redux/chatApislice';
import { setChats, setNotification } from '@/redux/chatAction';
import Avatar from '@/components/Avatar';
import LoadTyping from '@/components/LoadTyping';
import { generateChatsData } from '@/utils/generateChatData';
import Spinner from '@/components/Spinner';
import ChatInfoDialog from '@/components/chatInforDialog';
import dayjs from 'dayjs';

const ENDPOINT = process.env.nodeEnv === "development" ? process.env.DEV_APP_API : process.env.PRODUCTION_APP_API
var socket, selectedChat;

const page = ({params}) => {
    const [sendmessage] = useSendmessageMutation()
    const [getallchats] = useGetallchatsMutation()
    const [singleChat, setSingleChat] = useState(null)
    const [messages, setMessages] = useState([])
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [getallmessages] = useGetallmessagesMutation()
    const chats = useSelector(store=>store.chat?.chats)
    const user = useSelector(store=>store.auth?.user)
    const [socketIsConnected, setSocketISConnected] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [typing, setTyping] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openChatModal, setOpenChatModal] = useState(false)
    const notification = useSelector(store=>store.chat.notifications)

    useEffect(()=>{
        getAllChats()
    },[])

    useEffect(()=> {
        setLoading(true)
        const findChat = chats?.find((chat)=>chat._id === params.chatId)
        getAllMessagesByChat(params.chatId)
        if(findChat){
            if(chats.length < 1){
                setSingleChat(null)
                setLoading(false)
            }else{
                setSingleChat(findChat)
                setLoading(false)
            }
        }else{
            setSingleChat(null)
            setLoading(false)
        }
    }, [params])

    useEffect(()=>{
        if(user){
            socket = io(ENDPOINT)
            socket.removeAllListeners()
            socket.emit("setup", user)
            socket.on('connected', ()=>setSocketISConnected(true))
    
            socket.on("typing", ()=>setIsTyping(true))
            socket.on("typing_stop", ()=>setIsTyping(false))
        }
    }, [])

    useEffect(()=>{
        socket.on("message_received", (newMessage) => {
            if(!selectedChat || selectedChat._id !== newMessage.chat._id){
                if(!notification?.includes(newMessage)){
                    dispatch(setNotification(newMessage))
                    getAllChats()
                }
            }else{
                setMessages([...messages, newMessage])
                getAllChats()
            }
        })
    })

    const getAllMessagesByChat = async(id) => {
        try {
            const res = await getallmessages(id)
            setMessages([...res.data])
            socket.emit("join_chat", id)
        } catch (error) {
            console.log(error);
        }
    }



    const getAllChats = async() => {
        try {
          const chats = await getallchats()
          dispatch(setChats(chats.data))
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(()=>{
        selectedChat = singleChat
    }, [singleChat])

    const handleSubmit = async(e) => {
        e.preventDefault()
            socket.emit('typing_stop', singleChat._id)
            try {
                const res = await sendmessage({
                    message: message,
                    chatId: singleChat._id
                })
                setMessage('')
                socket.emit('new_message', res.data)
                setMessages([...messages, res.data])
                getAllChats()
            } catch (error) {
                console.log(error);
            }
        }

    const typingHandler = (e) => {
        setMessage(e.target.value)
        if(!socketIsConnected) return;
        if(!typing){
            setTyping(true)
            socket.emit('typing', singleChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timer = 3000

        setTimeout(()=>{
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timer && typing){
                socket.emit('typing_stop', singleChat._id)
                setTyping(false)
            }
        }, timer)
    }
    
  return (
    singleChat ? (
    <>
        <ChatInfoDialog
            isOpen={openChatModal}
            closeModal={()=>setOpenChatModal(false)}
            chat={singleChat}
        />
        <div
            className='relative w-[100%] h-[100%] pb-100px'
        >
            <div
            className='sticky md:absolute top-0 w-full h-[60px] flex flex-between px-10 bg-white shadow-md text-black z-40'
            >
                <h1 className='font-bold flex flex-row items-center gap-3'>
                    <span><Avatar size="small" /></span>
                    {
                    singleChat?.isGroupChat? singleChat?.chatName.toUpperCase() : singleChat?.users[0]?._id === user._id ? singleChat?.users[1]?.name : singleChat?.users[0]?.name
                    }
                </h1>
                <div className='flex flex-row gap-5'>
                    <PhoneIcon class="h-6 w-6 text-[red]" />
                    <VideoCameraIcon class="h-6 w-6 text-[red]" />
                    <InformationCircleIcon 
                    onClick={()=>setOpenChatModal(true)}
                    className="h-6 w-6 text-primary cursor-pointer" />
                </div>
            </div>
            <div className='h-full bg-white w-[100%] relative text-black p-5 overflow-auto'>
                <div
                className='flex flex-col mt-[70px] gap-2 justify-end md:pb-[5rem] pb-[8rem]'
                >
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col gap-5 items-center'>
                            <Avatar />
                            <h1 className='font-bold'>
                            {
                                singleChat?.isGroupChat? singleChat?.chatName.toUpperCase() : singleChat?.users[0]._id === user._id ? singleChat?.users[1].name : singleChat?.users[0].name
                            }
                            </h1>
                            {messages.length < 1  &&
                                <h1 className="text-primary font-bold">Start Conversation Now</h1>
                            }
                        </div>
                    </div>
                        {
                            messages?.map((item, index)=> (
                                <div className={`flex ${item?.sender?._id === user._id ? "flex-between" : ""}`}>
                                    <div></div>
                                    <div 
                                    key={index}
                                    className={`flex flex-row gap-1`}>
                                            <div className='group flex relative'>
                                                <Avatar size="xs" style={`
                                                    ${item?.sender?._id === user._id ? "hidden" : "block"}
                                                `} />
                                                <span class="group-hover:opacity-100 transition-opacity bg-gray-100 px-1 text-sm text-black rounded-md absolute left-1/2 
                                                -translate-x-1/2 translate-y-full opacity-0 m-4 z-50 mx-auto">{item?.sender?.name}</span>
                                            </div>
                                            <div className='flex flex-col gap-1 '>
                                                <div className={`message ${item?.sender?._id === user._id ? "bg-primary text-white" : "bg-secondary-100"}`}>
                                                    <h1

                                                    >{item?.message}
                                                    </h1>
                                                </div>
                                                <p className='text-[12px]'>{dayjs(item?.createAt).format("MM-DD-YYYY H:m A")}</p>
                                            </div>
                                    </div>
                                </div>
                            ))
                        }
                        {isTyping? (<LoadTyping />) : (<></>)}
                </div>
            </div>

            <div className='md:absolute fixed bottom-0 flex p-5 flex-between bg-white gap-5 h-fit w-[100%] 
            md:px-10 px-2 z-50'>
                <div className='flex flex-row items-center gap-3'>
                    <PlusCircleIcon className="md:h-8 md:w-8 w-5 h-5 text-primary" />
                    <PhotoIcon className="md:h-8 md:w-8 h-5 w-5 text-primary" />
                    <CameraIcon  className="md:h-8 md:w-8 h-5 w-5 text-primary" />
                </div>
                <form onSubmit={(e)=>handleSubmit(e)}
                className='w-[80%] h-[2.5rem] flex flex-row gap-10 items-center'
                >
                    <input
                        type='text'
                        placeholder='Aa'
                        className='w-full h-full rounded-full p-6 shadow-md outline-none focus:outline-primary'
                        value={message}
                        onChange={typingHandler}
                    />
                    <button
                        type="submit"
                        disabled={message === ''}
                    >
                        <PaperAirplaneIcon className={`h-8 w-8 ${message === '' ? "text-gray-100" : "text-primary"}`} />
                    </button>
                </form>
            </div>
        
        </div>
    </>
    ) : (<>
        <div className="w-[100vw] h-[100vh] text-black flex flex-col gap-0 items-center">
          <img src="/nodata.png" alt="No Data" className="w-[300px] h-[400px]" />
          <h1 className="text-[2rem] font-bold">No Message Here</h1>
        </div>
        </>)
  )
}

export default page
