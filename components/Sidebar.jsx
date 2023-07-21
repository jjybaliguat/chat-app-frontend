import React, { useState } from 'react'
import Chats from './Chats'
import Contact from './Contact'
import { motion } from 'framer-motion'
import CreateGroupDialog from './createGroupDialog'
import { Tab } from '@headlessui/react'

const Sidebar = ({isOpen, onClose}) => {
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)

  return (
    <>
        <CreateGroupDialog
            isOpen={open}
            closeModal={()=>setOpen(false)}
            // handleSubmit={handleCreateGroup}
        />
        <motion.div
        animate={{ 
            width: isOpen ? "350px" : "0px",
            left: isOpen? "0" : "-100%"
        }}
            className={`fixed top-[70px] left-0 flex flex-col gap-3 h-[100%] bg-white py-5 px-4 shadow-lg z-40`}
        >
            <Tab.Group>
                <Tab.List
                    className="flex flex-between"
                >
                    <div className='flex flex-row gap-3'>
                        <Tab
                        className={index == 0 ? "bg-secondary-100 p-2 rounded-[10px] outline-none" : ""}
                        onClick={()=>setIndex(0)}
                        >
                            Chats
                        </Tab>
                        <Tab
                        className={index == 1 ? "bg-secondary-100 p-2 rounded-[10px] outline-none" : ""}
                        onClick={()=>setIndex(1)}
                        >
                            Contacts
                        </Tab>
                    </div>
                    <button
                    onClick={()=>setOpen(true)}
                    className='p-2 hover:bg-secondary-100 rounded-[10px]'
                    >
                        <h1 className='text-[1rem] flex items-center font-bold text-primary cursor-pointer'>create group</h1>
                    </button>
                </Tab.List>
                <Tab.Panels className="h-[100vh] w-[350px] overflow-hidden">
                    <Tab.Panel
                    >
                        <Chats onClose={onClose} />
                    </Tab.Panel>
                    <Tab.Panel
                    className="bg-white h-full w-[100%]"
                    >
                        <Contact />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </motion.div>
    </>
  )
}

export default Sidebar
