"use client"

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React, { useState, useEffect } from 'react'
import { useLoginMutation, useLoginstatusMutation, useLogoutMutation } from '@/redux/authApiSlice'
import { getLoginStatus, logOut, setLoggedIn } from '@/redux/userAction'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/Sidebar'

export default function RootLayout({ children }) {
    const [open, setOpen] = useState(false)
    const loggedin = useSelector(store=>store.auth.logged_in)
    const toggleOpen = () => setOpen(!open)
    const router = useRouter()
    const [loginstatus] = useLoginstatusMutation()
    const [logout] = useLogoutMutation()
    const dispatch = useDispatch()

    useEffect(()=> {
      LoginStatus()
    }, [])

    async function LoginStatus() {
      try {
        const data = await loginstatus()
        if(data.data.logged_in){
          dispatch(setLoggedIn(data.data))
        }
        else{
          await logout()
          dispatch(logOut())
          router.push("/")
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <html lang="en" className='overflow-hidden'>
        <body className="relative dark:bg-slate-800 dark:text-white">
          {loggedin
          && (
          <>
          <Navbar toggleOpen={toggleOpen} open={open} />
            <div className={`flex flex-row h-[100vh] w-[100vw]`}>
                <Sidebar
                  isOpen={open}
                  onClose={()=>setOpen(false)}
                />
                <div className={`fixed md:relative h-[90%] w-[100vw] overflow-hidden`}>
                {children}
                </div>
            </div>
          </>
          )
          }
            {/* <Footer /> */}
        </body>
      </html>
    )
  }
