"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Avatar from './Avatar';
import {motion, useAnimation, useInView} from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { UserGroupIcon } from "@heroicons/react/24/outline";
import CreateGroupDialog from './createGroupDialog';



const Chats = ({isOpen}) => {
    const params = useParams()
    const router = useRouter()
    const user = useSelector(store=>store.auth?.user)
    const chats = useSelector(store=>store.chat?.chats)
    const [search, setSearch] = useState('')
    const [open, setOpen] = useState(false)

    const handleCreateGroup = () => {
        
    }

  return (
    <>
    <CreateGroupDialog
        isOpen={open}
        closeModal={()=>setOpen(false)}
        handleSubmit={handleCreateGroup}
    />
    <motion.div
    animate={{ 
        width: isOpen ? "350px" : "0px",
        position: isOpen? "relative" : "absolute",
        left: isOpen? "0" : "-100%"
    }}
        className={`left-0 flex flex-col gap-3 h-[100%] bg-white py-5 px-4 shadow-lg z-30`}
    >
        <div className='flex-between'>
            <h1 className='text-[1.5rem]'>Chats</h1>
            <button
                onClick={()=>setOpen(true)}
                className='p-2 hover:bg-secondary-100 rounded-[10px]'
            >
                <h1 className='text-[1rem] flex items-center font-bold text-primary cursor-pointer'>create group</h1>
            </button>
        </div>
        <div className='relative h-fit w-full'>
            <input
                type="text"
                className='h-full w-full p-3 pr-10 rounded-[10px] shadow-md outline-none hover:outline-1 hover:outline-primary'
                placeholder='Search Chats'
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon 
            className="absolute right-2 top-3 h-6 w-6 text-black" 
            />
        </div>
        <div className='flex flex-col gap-3'>
            <h1>Recent Chats</h1>
            {/* {!recentChats || recentChats.length < 1 && (<h1>No chats available</h1>)} */}
            <div className='h-[60vh] flex flex-col gap-0 overflow-hidden overflow-y-auto'>
            {
            chats?.filter((chat)=>
            chat?.chatName.toLowerCase().includes(search.toLowerCase())).map((item, index)=> (
                <div 
                key={index}
                onClick={()=>router.push(`/chats/${item._id}`)}
                className={`max-w-[350px] h-fit p-3 cursor-pointer ${params.chatId === item._id ? "bg-primary-100" : ""} p-3 hover:bg-primary-100 rounded-[10px]`}>
                    <div className='relative flex flex-row gap-3 items-center'>
                        <Avatar
                        size="small"
                        className="absolute left-0"
                         />
                        <div className='flex flex-col gap-0'>
                            <h1 className='font-bold flex flex-row items-center gap-3'>
                            {/* <span><Avatar size="small" /></span> */}
                                {
                                item?.isGroupChat? item?.chatName.toUpperCase() : item?.users[0]?._id === user._id ? item?.users[1]?.name : item?.users[0]?.name
                                }
                            </h1>
                            <div className='latest-message'>
                                <p className="ml-1">{item.latestMessages?.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
            </div>
        </div>
    </motion.div>
    </>
  )
}

export default Chats
