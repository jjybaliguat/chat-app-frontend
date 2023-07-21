"use client"
import React, { Fragment, useState } from 'react'
import Avatar from './Avatar';
import SearchBar from './SearchBar';
import { Bars3CenterLeftIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ProfileMenuDropDown from './menuDropDown';
import Notification from './Notification';
import { Menu, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { BellAlertIcon } from "@heroicons/react/24/outline";


const Navbar = ({open, toggleOpen}) => {
    const notification = useSelector(store=>store.chat.notifications)

  return (
    <>
        <header className='flex items-center sticky top-0 z-50 h-[70px] w-[100vw] bg-white shadow-md'>
            <nav
                className='flex-between w-full px-6 gap-5'
            >
                <div className='flex flex-row-reverse md:flex-row items-center gap-5'>
                    <SearchBar
                    divStyle="h-[50px] w-[250px]"
                    inputStyle="gradient-bg  md:placeholder-white"
                    />
                    {
                        open ? (
                            <XMarkIcon className="h-8 w-8 text-black cursor-pointer"
                                onClick={toggleOpen}
                            />
                        ) : (
                            <Bars3CenterLeftIcon className="h-8 w-8 text-black cursor-pointer" 
                                onClick={toggleOpen}
                            />
                        )
                    }
                </div>
                <div>
                    <h1 className='md:text-[2rem] text-[1rem] hidden md:flex font-extrabold text-primary'>
                        Welcome to Just-Chat
                    </h1>
                </div>
                {/* Profile and notification section */}
                <div className='flex flex-row gap-3 items-center'>
                    <Notification />
                    <ProfileMenuDropDown />
                </div>
            </nav>
        </header>
    </>
  )
}

export default Navbar
