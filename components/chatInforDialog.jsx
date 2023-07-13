"use client"

import React, { useEffect, useState } from 'react'
import { Fragment } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { useAddchatmemberMutation, useDeletegroupMutation, useRemovechatmemberMutation, useSearchuserMutation } from '@/redux/chatApislice';
import Avatar from './Avatar';
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from 'react-redux';
import { addChat, removeChat, updateChat } from '@/redux/chatAction';
import { notification } from 'antd';
import dayjs from 'dayjs';
import ConfirmDialog from './ConfirmDialog';
import { useRouter } from 'next/navigation';
import LoadTyping from './LoadTyping';

const Context = React.createContext({
    name: 'Default',
  });


const ChatInfoDialog = ({isOpen, chat, closeModal}) => {
    const [api, contextHolder] = notification.useNotification();
    const chats = useSelector(store=>store.chat.chats)
    const [currentChat, setCurrentChat] = useState(null)
    const user = useSelector(store=>store.auth?.user)
    const dispatch = useDispatch()
    const [deletegroup] = useDeletegroupMutation()
    const [removechatmember] = useRemovechatmemberMutation()
    const [addchatmember] = useAddchatmemberMutation()
    const router = useRouter()
    const [addUsers, setAddUsers] = useState(null)
    const [users, setUsers] = useState(null)
    const [query, setQuery] = useState('')
    const [addMember, setAddMember] = useState(false)
    const [searchuser] = useSearchuserMutation()
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        setCurrentChat(chat)
    }, [])

    const handleRemoveUser = async(id) => {
        if(confirm("Are you sure you want to remove this chat member?") == true){
            try {
                const res = await removechatmember({
                    chatId: chat._id,
                    userId: id
                })
                if(res.data){
                    dispatch(updateChat(res.data))
                    setCurrentChat(res.data)
                    api['success']({
                        message: 'Chat member successfully removed',
                        placement: 'topLeft'
                    });
                }
            } catch (error) {
                console.log(error.message);
                api['error']({
                    message: 'Error while removing chat member',
                    placement: 'topLeft'
                });
            }
        }
    }

    const handleDeleteGroup = async(id) => {
        if(confirm("Are you sure you want to delete this group?") == true){
            try {
                const res = await deletegroup({
                    chatId: id
                })
                if(res.data){
                    dispatch(removeChat({chatId: id}))
                    router.push(`${chats[0]._id}`)
                    api['success']({
                        message: 'Group Successfully deleted',
                        placement: 'topLeft'
                    });
                    closeModal()
                }
            } catch (error) {
                console.log(error);
                api['error']({
                    message: 'Failed deleting the group',
                    placement: 'topLeft'
                });
            }
        }
    }

    useEffect(()=> {
        handleSearch()
    }, [query])

    const handleSearch = async() => {
        setLoading(true)
        try {
            const res = await searchuser(query)
            setUsers([...res.data])
            setLoading(false)
          } catch (error) {
            console.log(error);
          }
    }

    const handleAddMember = async() => {
        let userIds = []
        addUsers.map((user)=>userIds.push(user._id))
        try {
            const response = await addchatmember({
                chatId: chat._id,
                users: userIds
            })
            if(response.data){
                setCurrentChat({...currentChat, users: [...currentChat.users, ...addUsers]})
                setAddUsers(null)
                api['success']({
                    message: 'Chat members added',
                    placement: 'topLeft'
                });
            }
        } catch (error) {
            console.log(error);
            api['error']({
                message: 'Error adding members',
                placement: 'topLeft'
            });
        }
    }

    const handleAdd = (user) => {
        let arr = []
        if(!isUserAlreadyMember(user)){
            if(!(addUsers?.find((item)=>item._id === user._id))){
                arr.push(user)
            }
            if(addUsers){
                setAddUsers([...addUsers, ...arr])
            }else{
                setAddUsers([...arr])
            }
        }else{
            api['error']({
                message: `${user.name} is already a member`,
                placement: 'topLeft'
            });
        }
    }

    function isUserAlreadyMember (user){
        return currentChat.users.some(elem => elem._id === user._id)
    }

    const handleRemove = (data) => {
        let newUsers = addUsers.filter((user)=>user._id !== data._id)
        setAddUsers(newUsers)
    }


  return (
    currentChat &&
    <>
    {contextHolder}
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50"
            onClose={closeModal}
        >
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom='opacity-0 scale-95'
                        enterTo='opacity-100 scale-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <Dialog.Panel className="relative w-full 
                        max-w-lg max-h-[95vh] overflow-y-auto 
                        transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full"
                            >
                                <XMarkIcon className="h-6 w-6 text-gray-500" />
                            </button>
                            <div className="flex-1 flex flex-col gap-3 items-center">
                                <div className='flex flex-col items-center gap-3'>
                                    <h1 className='font-bold text-center text-[1.5rem]'>{currentChat?.isGroupChat? currentChat.chatName : "Chat Info"}</h1>
                                    {currentChat?.isGroupChat && currentChat.groupAdmin._id === user._id &&
                                        <button className='p-2 rounded-[10px] bg-primary text-white'
                                        onClick={()=>setAddMember(true)}
                                        >
                                            Add Member
                                        </button>
                                    }
                                </div>
                                {addMember &&
                                    <div>
                                        <Combobox>
                                        <div className="relative mt-1">
                                            <div className='flex flex-row gap-3'>
                                                <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md sm:text-sm">
                                                <Combobox.Input
                                                placeholder='Search Users'
                                                className='p-5 w-full rounded-[10px] shadow-mg outline-none hover:outline-2 hover:outline-primary'
                                                onChange={(e)=>setQuery(e.target.value)}
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </Combobox.Button>
                                            </div>
                                            <div className='flex flex-row gap-3'>
                                                    <button
                                                    disabled={!(addUsers?.length > 0)}
                                                    onClick={handleAddMember}
                                                    className={`${addUsers?.length > 0 ? "text-primary cursor-pointer" : "text-secondary cursor-not-allowed"}`}>
                                                        Add</button>
                                                    <button 
                                                    onClick={()=>{setAddMember(false); setAddUsers(null)}}
                                                    className='text-warning cursor-pointer'>Cancel</button>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='flex flex-wrap gap-3 mt-3'>
                                                {
                                                addUsers?.map((user, id)=> (
                                                    <div key={id} className='relative bg-secondary p-2 rounded-[10px] w-fit text-white'>
                                                        <h1>{user.name}</h1>
                                                        <XCircleIcon
                                                        onClick={()=>handleRemove(user)}
                                                        className="h-7 w-7 absolute top-[-10px] right-[-10px] text-[red] cursor-pointer font-bold p-1" />
                                                    </div>
                                                ))
                                                }
                                                </div>
                                            </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                            afterLeave={() => setQuery('')}
                                        >
                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-3 
                                            text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                            {loading && <div>Searching...</div>}
                                            {users?.length === 0 || query === '' ? (
                                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                No Users Found.
                                                </div>
                                            ) : (
                                                users?.map((user) => (
                                                <Combobox.Option
                                                    key={user._id}
                                                    className={({ active }) =>
                                                    `relative cursor-pointer select-none py-5 pl-16 pr-4 ${
                                                        active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                                                    }`
                                                    }
                                                    value={user}
                                                    onClick={()=>handleAdd(user)}
                                                >
                                                    {({ selected, active }) => (
                                                    <>
                                                        <span
                                                        className={`block truncate ${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                        >
                                                        {user.name}
                                                        </span>
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                                                        >
                                                            <Avatar size="small" />
                                                        </span>
                                                    </>
                                                    )}
                                                </Combobox.Option>
                                                ))
                                            )}
                                            </Combobox.Options>
                                        </Transition>
                                            
                                        </div>
                                    </Combobox>
                                    </div>
                                }
                                { chat.isGroupChat ? (
                                <>
                                <div className='flex flex-row items-center gap-5'>
                                    <h1>Date Created</h1>
                                    <p>{dayjs(currentChat?.createdAt).format("MMMM DD, YYYY (H:m A)")}</p>
                                </div>
                                <h1>Chat Members</h1>
                                <div className='flex flex-col gap-5 h-[200px] w-full overflow-y-auto p-5'>
                                    {currentChat?.users.map((member)=>(
                                        <div className='flex-between'>
                                            <div className='flex flex-row items-center gap-3'>
                                                <Avatar size="xs" />
                                                {member.name}
                                            </div>
                                            {currentChat?.isGroupChat && currentChat.groupAdmin?._id === user._id &&
                                                <p className={`text-[red]
                                                ${user._id === member._id ? "cursor-not-allowed text-gray-100" : "cursor-pointer"}
                                                `}
                                                onClick={()=>handleRemoveUser(member._id)}
                                                >remove</p>
                                            }
                                        </div>
                                    ))}
                                </div>
                                {currentChat?.isGroupChat && chat.groupAdmin?._id === user._id &&
                                    <button className='text-[red] font-bold'
                                        onClick={()=>handleDeleteGroup(currentChat._id)}
                                    >
                                        Delete this Group
                                    </button>
                                }
                            </>
                                ) : (
                                    <>
                                    <div className='flex flex-center w-full'>
                                        <div className='flex flex-col gap-5 items-center'>
                                            <Avatar />
                                            <h1>
                                            {currentChat?.users[0]._id === user._id ? currentChat?.users[1].name : currentChat?.users[0].name}
                                            </h1>
                                            <div className='flex flex-row items-center gap-5'>
                                                <h1>Chat friend since</h1>
                                                <p className='font-bold'>{dayjs(currentChat.createdAt).format("MMMM DD, YYYY")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                )
                            }
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
    </>
  )
}

export default ChatInfoDialog
