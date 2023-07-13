"use client"

import React, { useEffect, useState } from 'react'
import { Fragment } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Avatar from './Avatar';
import { notification } from 'antd';
import dayjs from 'dayjs';



const ConfirmDialog = ({isOpen, closeModal, onConfirm}) => {

  return (
    <>
    <Transition appear show={isOpen.open} as={Fragment}>
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
                                <h1 className='font-bold text-center text-[1.5rem]'>{isOpen.title}</h1>
                                <div className='flex flex-row gap-5'>
                                    <button
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                    onClick={onConfirm}
                                    >
                                        Yes
                                    </button>
                                </div>
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

export default ConfirmDialog
