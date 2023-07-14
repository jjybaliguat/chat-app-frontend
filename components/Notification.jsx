"use client"
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import Avatar from './Avatar'
import { useLogoutMutation } from '@/redux/authApiSlice'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Link from 'next/link'
import { removeNotif } from '@/redux/chatAction'
import { Badge } from 'antd'

const Notification = () => {

    const notification = useSelector(store=>store.chat.notifications)
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(removeNotif(params.chatId))
    }, [params.chatId])

  return (
    <>
    <Menu as="div" className="relative inline-block text-left z-50">
        <div>
          <Menu.Button className="inline-flex w-full justify-center px-4 py-2">
            <Badge count={notification?.length}>
                <BellAlertIcon className="h-6 w-6 text-gray-500" />
            </Badge>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="h-[300px] overflow-y-auto w-[250px] absolute cursor-pointer right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
           {!notification?.length && <h1 className='text-center mt-[5rem] font-bold'>Nothing here!</h1>}
           {notification && (
            notification?.map((item, id)=>(
                <div className="px-1 py-1"
                key={id}
                >
                <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? 'bg-secondary-100 text-black' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={()=>router.push(item.chat._id)}
                      >
                        <div className='latest-message'>
                            <h1 className='font-bold'>New message from {item?.sender?.name}</h1>
                            <p className='ml-5 text-[12px]'>{item?.message}</p>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                </div>
                ))
           )
           }
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default Notification
