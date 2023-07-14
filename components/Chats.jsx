"use client"

import React, { useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {motion, useAnimation, useInView} from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { UserGroupIcon } from "@heroicons/react/24/outline";
import CreateGroupDialog from './createGroupDialog';
import { Avatar } from 'antd';



const Chats = () => {
    const params = useParams()
    const router = useRouter()
    const user = useSelector(store=>store.auth?.user)
    const chats = useSelector(store=>store.chat?.chats)
    const [search, setSearch] = useState('')

  return (
    <>
        <div className='relative h-fit w-[90%]'>
            <div className='h-full w-[100%]'>
                <input
                    type="text"
                    className='w-full p-3 p r-10 rounded-[10px] shadow-md outline-none'
                    placeholder='Search Chats'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <MagnifyingGlassIcon 
                className="absolute right-5 top-3 h-6 w-6 text-black" 
                />
            </div>
            <div className='flex flex-col gap-3'>
            <h1>Recent Chats</h1>
            {/* {!recentChats || recentChats.length < 1 && (<h1>No chats available</h1>)} */}
            <div className='h-[60vh] flex flex-col gap-0 overflow-hidden overflow-y-auto'>
            {
            chats?.filter((chat)=>
            chat?.chatName.toLowerCase().includes(search.toLowerCase())).map((item, index)=> (
                <div key={index} className='flex flex-row gap-3 items-center cursor-pointer hover:bg-secondary-100 p-3 rounded-md'
                onClick={()=>router.push(`/chats/${item._id}`)}
                >
                            <Avatar
                                size={30}
                                icon={<img src="/avatardefault.png"/>}
                            />
                            <div className='flex flex-col'>
                                <h1 className='font-bold'>{item?.isGroupChat? item?.chatName.toUpperCase() : item?.users[0]?._id === user._id ? item?.users[1]?.name : item?.users[0]?.name}</h1>
                                <p className="ml-1">{item.latestMessages?.message}</p>
                            </div>
                        </div>
            ))
            }
            </div>
        </div>
        </div>
    </>
  )
}

export default Chats
