'use client'
 
import React, { useEffect, useRef, useState } from 'react'
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
import LoadTyping from '@/components/LoadTyping';
import { generateChatsData } from '@/utils/generateChatData';
import Spinner from '@/components/Spinner';
import ChatInfoDialog from '@/components/chatInforDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { setOnlineUsers } from '@/redux/userAction';
import Avatar from '@/components/Avatar';
dayjs.extend(relativeTime)

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
    const messageRef = useRef(null)
    const [active, setActive] = useState(false)
    const onlineUsers = useSelector((store=>store.auth.onlineUsers))

    useEffect(()=>{
        getAllChats()
    },[])

    useEffect(()=>{
        if(!(singleChat?.isGroupChat)){
            if(singleChat?.users[0]._id === user._id){
                setActive(onlineUsers?.some((active)=>active.userId === singleChat?.users[1]._id))
            }else{
                setActive(onlineUsers?.some((active)=>active.userId === singleChat?.users[0]._id))
            }
        }else{
            const currentUsers = singleChat?.users.filter((item)=>item._id !== user._id)
            let activeGroup = false
            currentUsers?.map((item)=>{
                if(onlineUsers?.some((user)=>user.userId === item._id)){
                    activeGroup = true
                }
            })
            setActive(activeGroup)
        }
    })



    useEffect(()=>{
        messageRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

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
        const handleFocus = async () => {
            socket.emit("setup", user);
            socket.on("get-users", (users) => {
                dispatch(setOnlineUsers(users))
            });
            };

        const handleClose = () => {
            if(user){
                socket.emit("offline", user)
            }
        }
        
        const handleBlur = () => {
            if(user) {
                let lastFocus = new Date().getTime()
                var timer = 600000

                setTimeout(()=>{
                    var timeNow = new Date().getTime()
                    var timeDiff = timeNow - lastFocus

                    if(timeDiff >= timer){
                        socket.emit("offline", user)
                    }
                }, timer)
            }
          };

          window.addEventListener('focus', handleFocus);
          window.addEventListener('beforeunload', handleClose);
          window.addEventListener('blur', handleBlur);

          return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('beforeunload', handleBlur);
          }; 
    }, [user])

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
            className='relative w-[100%] h-[100%]'
        >
            <div
            className='fixed top-[70px] w-full h-[60px] max-w-[100vw] flex flex-between px-10 bg-white shadow-md text-black z-40'
            >
                <div className='flex flex-row items-center gap-3'>
                    <span className='relative'><Avatar size="small" />
                    <div className={`absolute h-[10px] w-[10px] bottom-0 right-0 
                    ${active ? `bg-success` : `bg-gray-400`}    
                    rounded-full`} />
                    </span>
                    <div className='flex flex-col gap-0'>
                        <h1 className='font-bold flex flex-row items-center gap-3 text-[0.5rem] md:text-[1rem]'>
                        {
                        singleChat?.isGroupChat? singleChat?.chatName.toUpperCase() : singleChat?.users[0]?._id === user._id ? singleChat?.users[1]?.name : singleChat?.users[0]?.name
                        }
                        </h1>
                        {!singleChat.isGroupChat &&
                        <p>{active ? "active now" : "offline"}</p>
                        }
                    </div>
                </div>
                <div className='flex flex-row gap-5'>
                    <PhoneIcon class="h-6 w-6 text-[red]" />
                    <VideoCameraIcon class="h-6 w-6 text-[red]" />
                    <InformationCircleIcon 
                    onClick={()=>setOpenChatModal(true)}
                    className="h-6 w-6 text-primary cursor-pointer" />
                </div>
            </div>
            <div className='h-full w-[100%] relative text-black pt-20 p-5 overflow-auto'>
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
                                <>
                                <div key={index} ref={messageRef} className={`flex ${item?.sender?._id === user._id ? "flex-between" : ""}`}>
                                    <div></div>
                                    <div 
                                    className={`relative flex flex-row gap-1 items-center`}>
                                            <div className='group flex relative'>
                                                <Avatar size="xs" style={`
                                                    ${item?.sender?._id === user._id ? "hidden" : "block"}
                                                `} />
                                                <span className="group-hover:opacity-100 transition-opacity bg-gray-100 px-1 text-sm text-black rounded-md absolute left-1/2 
                                                -translate-x-1/2 translate-y-full opacity-0 m-4 z-50 mx-auto">{item?.sender?.name}</span>
                                            </div>
                                            <div className='group flex flex-col relative'>
                                                <p className='text-[12px]'>{dayjs(item.createdAt).fromNow()}</p>
                                                <div className={`${item?.sender?._id === user._id ? "flex-between flex-row" : ""}`}>
                                                    <div></div>
                                                    <div className={`message ${item?.sender?._id === user._id ? "bg-primary text-white" : "bg-secondary-100"}`}>
                                                        <h1
                                                        >{item?.message}
                                                        </h1>
                                                    </div>
                                                </div>
                                                {singleChat?.isGroupChat &&
                                                    <div className={`${item?.sender?._id === user._id ? "flex-between flex-row" : ""}`}>
                                                        <div></div>
                                                        <p className='text-[12px]'>{item?.sender?._id === user._id ? "" : item?.sender?.name}</p>
                                                    </div>
                                                }
                                                {/* <span class="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
                                                    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto">{dayjs(item?.createAt).format("MM-DD-YYYY H:m A")}</span> */}
                                            </div>
                                    </div>
                                </div>
                                </>
                            ))
                        }
                        {isTyping? (<LoadTyping />) : (<></>)}
                </div>
            </div>

            <div className='fixed bottom-0 flex p-4 flex-between bg-white gap-5 h-fit w-[100%] 
            md:px-10 px-2 z-40'>
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
                        <PaperAirplaneIcon className={`h-8 w-8 ${message === '' ? "text-gray-300" : "text-primary"}`} />
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
