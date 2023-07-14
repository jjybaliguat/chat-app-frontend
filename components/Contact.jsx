"use client"

import { Avatar } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddContactDialog from './AddContactDialog'

const Contact = () => {
    const chats = useSelector(store=>store.chat.chats)
    const user = useSelector(store=>store.auth.user)
    const [openAddContact, setOpenAddContact] = useState(false)
    

  return (
    <>
    <AddContactDialog 
        isOpen={openAddContact}
        closeModal={()=>setOpenAddContact(false)}
    />
    <div className='flex flex-col mt-5 gap-3 items-center h-full w-[90%]'>
        <button
        className='w-[80%] bg-secondary-100 rounded-[15px] p-1 text-[12px]'
        onClick={()=>setOpenAddContact(true)}
        >
          +  Add New Contact
        </button>
        <div className='w-[100%] h-full'>
            <h1>My contacts</h1>
            <div
            className='h-[70%] overflow-y-auto flex flex-col gap-3 mt-5'
            >
                {
                    chats?.map((chat)=>(
                        <div key={chat._id} className='flex flex-row gap-3 items-center cursor-pointer hover:bg-secondary-100 p-3 rounded-md'>
                            <Avatar
                                size={30}
                                icon={<img src="/avatardefault.png"/>}
                            />
                            <h1>{chat?.isGroupChat? chat?.chatName.toUpperCase() : chat?.users[0]?._id === user._id ? chat?.users[1]?.name : chat?.users[0]?.name}</h1>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
    </>
  )
}

export default Contact
