"use client"

import { useSearchuserMutation } from '@/redux/chatApislice'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Avatar } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'

const AddContactDialog = ({isOpen, closeModal}) => {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState(null)
    const [searchuser] = useSearchuserMutation()

    const handleClickAdd = () => {

    }

    useEffect(()=> {
        searchUsers()
    }, [query])

    const searchUsers = async() => {
        try {
            const res = await searchuser(query)
            setUsers([...res.data])
          } catch (error) {
            console.log(error);
          }
    }


  return (
    <>
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
                <div className="fixed inset-0 overflow-y-auto h-[100vh]">
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
                            max-w-lg h-[90vh] overflow-none 
                            transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full"
                                >
                                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                                </button>
                                <div className="flex-1 flex flex-col gap-3">
                                    <h1 className='font-bold text-center text-[1.5rem]'>Add new contact</h1>
                                    <Combobox>
                                        <div className="relative mt-1">
                                        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md sm:text-sm">
                                            <Combobox.Input
                                            placeholder='Search people'
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
                                                    `relative select-none py-5 pl-16 pr-4 ${
                                                        active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                                                    }`
                                                    }
                                                    value={user}
                                                    // onClick={()=>handleAdd(user)}
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
                                                            <Avatar size={25} icon={<img  src="/avatardefault.png" />} />
                                                        </span>
                                                        <button
                                                        className='absolute right-5 top-3 bg-primary p-2 rounded-[10px] text-white'
                                                        >
                                                            Add
                                                        </button>
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default AddContactDialog
