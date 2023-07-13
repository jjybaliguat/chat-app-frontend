"use client"

import React, { useEffect } from 'react'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import { Tab } from '@headlessui/react'
import { useSelector } from 'react-redux'
import { getLoginStatus } from '@/redux/userAction'
import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/redux/authApiSlice'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const isLoggedIn = useSelector(store=>store.auth.logged_in)
  const router = useRouter()

  useEffect(() => {
    console.log(isLoggedIn);
    if(isLoggedIn){
      router.push("/chats")
    }else{
      router.push("/")
    }
  }, [])
  
  return (
    <main className="relative overflow-hidden
      flex items-center flex-col
    ">
      <h1
      className='text-center mt-[5rem] text-[2rem]'
      >Welcome to Chat App!</h1>
      <div className="w-full max-w-md px-2 py-16 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white shadow-lg p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'focus:outline-none',
                    selected
                      ? 'bg-gradient-to-l from-primary to-primary-100 shadow text-white'
                      : 'text-black hover:bg-primary/[0.12]'
                  )
                }
              >
                Login
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'focus:outline-none',
                    selected
                    ? 'gradient-bg shadow text-white'
                      : 'text-black hover:bg-primary/[0.12]'
                  )
                }
              >
                SignUp
              </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel
                  className='rounded-xl bg-white p-3 shadow-lg'
                >
                  <Login />
              </Tab.Panel>
            <Tab.Panel
                  className='rounded-xl bg-white p-3 shadow-lg'
                >
                  <SignUp />
              </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </main>
  )
}