"use client"

import React, { useEffect, useState } from 'react'
import { Fragment } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { useCrerategroupchatMutation, useSearchuserMutation } from '@/redux/chatApislice';
import Avatar from './Avatar';
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from 'react-redux';
import { addChat } from '@/redux/chatAction';
import { notification } from 'antd';
import { useRouter } from 'next/navigation';

const Context = React.createContext({
    name: 'Default',
  });


const CreateGroupDialog = ({isOpen, closeModal}) => {
    const [api, contextHolder] = notification.useNotification();
    const chats = useSelector(store=>store.chat.chats)
    const [chatData, setChatData] = useState({
        chatName: "",
        users: []
    })
    const [users, setUsers] = useState(null)
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [creategroupchat] = useCrerategroupchatMutation()
    const dispatch = useDispatch()
    const [searchuser] = useSearchuserMutation()
    const openNotification = (type, message) => {
        api[type]({
            message: message,
            placement: 'topLeft'
        });
      };

    const handleAdd = (user) => {
        let arr = []
        if(!(chatData.users.find((item)=>item._id === user._id))){
            arr.push(user)
        }
        setChatData({...chatData, users: [...chatData.users, ...arr]})
    }

    const handleRemove = (data) => {
        let newUsers = chatData.users.filter((user)=>user._id !== data._id)
        setChatData({...chatData, users: newUsers})
    }

    useEffect(()=> {
        handleSearch()
    }, [query])

    const handleSearch = async() => {
        try {
            const res = await searchuser(query)
            setUsers([...res.data])
          } catch (error) {
            console.log(error);
          }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(chatData.users.length <= 1){
            api['error']({
                message: 'Please add atleast 2 chat members',
                placement: 'topLeft'
            });
        }else{
            let userIds = []
            chatData.users.map((user)=>userIds.push(user._id))
            try {
                const res = await creategroupchat({
                    chatName: chatData.chatName,
                    users: userIds
                })
                if(res?.data){
                    dispatch(addChat(res.data))
                    router.push(res.data._id)
                    closeModal()
                    api['success']({
                        message: 'Group successfuly created',
                        placement: 'topLeft'
                    });
                    setChatData({
                        chatName: '',
                        users: []
                    })
                }
            } catch (error) {
                console.log(error);
                api['error']({
                    message: error.data?.message,
                    placement: 'topLeft'
                });
            }
        }
    }

  return (
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
                            <div className="flex-1 flex flex-col gap-3">
                                <h1 className='font-bold text-center text-[1.5rem]'>Create Group Chat</h1>
                                <form onSubmit={handleSubmit}
                                    className='flex flex-col gap-3'
                                >
                                    <input
                                        type='text'
                                        placeholder='Enter Group Name'
                                        className='p-5 w-full rounded-[10px] shadow-mg outline-none hover:outline-2 hover:outline-primary'
                                        value={chatData.chatName}
                                        onChange={(e)=>setChatData({...chatData, chatName: e.target.value})}
                                        required
                                    />
                                    <Combobox>
                                        <div className="relative mt-1">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md sm:text-sm">
                                            <Combobox.Input
                                            placeholder='Add Members'
                                            className='p-5 w-full rounded-[10px] shadow-mg outline-none hover:outline-2 hover:outline-primary'
                                            value={query}
                                            onChange={(e)=>setQuery(e.target.value)}
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </Combobox.Button>
                                        </div>
                                        <div className='flex flex-wrap gap-3 mt-3'>
                                            {
                                            chatData.users.map((user, id)=> (
                                                <div key={id} className='relative bg-secondary p-2 rounded-[10px] w-fit text-white'>
                                                    <h1>{user.name}</h1>
                                                    <XCircleIcon
                                                    onClick={()=>handleRemove(user)}
                                                    className="h-7 w-7 absolute top-[-10px] right-[-10px] text-[red] cursor-pointer font-bold p-1" />
                                                </div>
                                            ))
                                            }
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
                                    <button
                                        type="submit"
                                        className='p-5 w-[100%] rounded-[10px] text-white bg-primary'
                                    >
                                        Create
                                    </button>
                                </form>
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

export default CreateGroupDialog
