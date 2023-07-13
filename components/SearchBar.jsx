"use client"
import React, { Fragment, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Combobox, Transition } from '@headlessui/react';
import { useFetchchatMutation, useSearchuserMutation } from '@/redux/chatApislice';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import { addChat } from '@/redux/chatAction';
import { useDispatch } from 'react-redux';

const SearchBar = ({
    divStyle,
    inputStyle
}) => {

  const [users, setUsers] = useState()
  const [query, setQuery] = useState('')
  const [searchuser] = useSearchuserMutation()
  const [fetchchat] = useFetchchatMutation()
  const router = useRouter()
  const dispatch = useDispatch()


  useEffect(()=>{
    searchUser()
  },[query])

  const searchUser = async() => {
    try {
      const res = await searchuser(query)
      setUsers([...res.data])
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateChat = async(id) => {
    try {
      const res = await fetchchat({
        userId: id
      })
      dispatch(addChat(res.data))
      router.push(`/chats/${res.data?._id}`)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`${divStyle} relative`}>
      <Combobox>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md sm:text-sm">
            <Combobox.Input
              className="w-full placeholder-white border-none outline focus:outline-2 outline-primary gradient-bg py-3 pl-3 pr-10 text-sm leading-5 text-gray-900"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search User"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon 
                className="absolute right-2 top-3 h-6 w-6 text-white" />
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
                      `relative cursor-pointer select-none py-5 pl-16 pr-4 ${
                        active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                      }`
                    }
                    value={user}
                    onClick={()=>handleCreateChat(user._id)}
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
  )
}

export default SearchBar
